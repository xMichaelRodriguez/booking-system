import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { IGoogleAccount } from '@/interfaces/gogle.interface';
import { MailService } from '@/modules/mail/mail.service';
import { RoleRepositoryService } from '@/modules/role/role-repository.service';

import { ActivateUserDto } from './dto/activate-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateGoogleDto } from './dto/create-google.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EncoderService } from './encoder/encoder.service';
import User from './entities/auth.entity';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  #logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly roleRepository: RoleRepositoryService,

    private encoderService: EncoderService,

    private jwtService: JwtService,

    private mailService: MailService,

    private readonly httpService: HttpService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    try {
      const { password } = createAuthDto;
      const plainTextToHash = await this.encoderService.encodePassword(
        password,
      );

      const role = await this.roleRepository.getDefaultRole();
      const user = await this.userRepository.create({
        ...createAuthDto,
        password: plainTextToHash,
        activationToken: v4(),
        role,
      });
      const userToSave = await this.userRepository.save(user);
      await this.mailService.sendVerificationUsers(user, user.activationToken);
      return new User(userToSave);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('This email is already registered');

      this.#logger.error({ error });

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.findByEmail(loginAuthDto.email);

    if (user.isGoogleAccount)
      throw new BadRequestException(
        'This email is already registered with a google account',
      );

    const checkPassword = await this.encoderService.checkPassword(
      loginAuthDto.password,
      user.password,
    );

    if (!checkPassword)
      throw new UnauthorizedException('Please check your credentials');

    if (!user.isActive)
      throw new UnauthorizedException('Please verify your account');

    const { id, email, isActive, role } = user;
    const payload: JwtPayload = {
      id,
      email,
      isActive,
      role,
    };
    try {
      const accessToken = this.jwtService.sign(payload);

      return {
        user: new User(user),
        jwt: { accessToken },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error trying to sign in');
    }
  }

  async activateUser(activateUserDto: ActivateUserDto): Promise<void> {
    const { id, code } = activateUserDto;
    const user: User = await this.findOneInactiveByIdActivationToken(+id, code);
    if (!user)
      throw new UnprocessableEntityException('This action can not be done');

    try {
      await this.userRepository.update(user.id, {
        ...user,
        isActive: true,
        activationToken: null,
      });
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying activation account');
    }
  }

  async findOneInactiveByIdActivationToken(id: number, code: string) {
    return await this.userRepository.findOne({
      where: { id, activationToken: code, isActive: false },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });
    if (!user)
      throw new NotFoundException(`user with email: ${email} not found`);

    return user;
  }

  async requestResetPassword(
    requestResetPassword: RequestResetPasswordDto,
  ): Promise<void> {
    const { email } = requestResetPassword;
    try {
      const user: User = await this.findByEmail(email);

      const resetPasswordToken = v4();
      await this.userRepository.update(
        user.id,

        { ...user, resetPasswordToken },
      );
      await this.mailService.sendResetPassword(user, resetPasswordToken);
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying to reset password');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { password, resetPasswordToken } = resetPasswordDto;

      const user: User = await this.findOneByResetPasswordToken(
        resetPasswordToken,
      );
      const newPassword = await this.encoderService.encodePassword(password);

      await this.userRepository.update(user.id, {
        ...user,
        password: newPassword,
        resetPasswordToken: null,
      });

      return {
        response:
          'Password successfully updated. Please log in with your new password at your next login.',
      };
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying to reset');
    }
  }

  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { resetPasswordToken },
    });
    if (!user) throw new NotFoundException();

    return user;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;

    const isValid = await this.encoderService.checkPassword(
      oldPassword,
      user.password,
    );

    if (!isValid) throw new BadRequestException('old password does not match');

    const hashPassword = await this.encoderService.encodePassword(newPassword);
    await this.userRepository.update(user.id, {
      ...user,
      password: hashPassword,
    });
  }

  async prepareUserRegister(req) {
    if (!req.user) throw new NotFoundException('Not user from google');

    const user = {
      username: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
    };
    const userExist: User = await this.userRepository.findOne({
      where: { email: user.email },
      relations: { role: true },
    });

    if (!userExist) return this.registerUserWithGoogle(user);

    return this.loginWithGoogle(userExist);
  }

  async loginWithGoogle(loginAuthDto: User) {
    if (!loginAuthDto.isGoogleAccount)
      throw new ConflictException(
        'This email is already registered with a local account',
      );

    const { id, email, isActive, role } = loginAuthDto;
    const payload: JwtPayload = {
      id,
      email,
      isActive,
      role,
    };
    try {
      const accessToken = await this.jwtService.sign(payload);

      return {
        user: new User(loginAuthDto),
        jwt: { accessToken },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error trying to sign in');
    }
  }

  async prepareLoginGoogle(accessToken: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IGoogleAccount>(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.#logger.error(error.response.data);
            throw new Error('An error happened!');
          }),
        ),
    );
    const userExist: User = await this.userRepository.findOne({
      where: { email: data.email },
      relations: { role: true },
    });
    const user = {
      username: data.name,
      email: data.email,
    } as User;

    if (!userExist) return this.registerUserWithGoogle(user);

    return this.loginWithGoogle(userExist);
  }

  async registerUserWithGoogle(user: CreateGoogleDto) {
    const role = await this.roleRepository.getDefaultRole();
    const values = {
      ...user,
      isGoogleAccount: true,
      isActive: true,
      role,
    } as User;

    try {
      const { id, email, isActive, role } = await this.userRepository.save(
        values,
      );
      const payload: JwtPayload = {
        id,
        email,
        isActive,
        role,
      };

      const accessToken = await this.jwtService.sign(payload);

      return { user, jwt: accessToken };
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('This email is already registered');

      this.#logger.debug(error);

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async getProfile(user: User) {
    return new User(user);
  }

  async subscriptionToNotifications(token: string, user: User) {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ deviceToken: token })
      .where('id = :id', { id: user.id })
      .execute();
  }

  async checkSubscriptions(id: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneBy({
        id,
      });

      return !!user.deviceToken;
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Something Wen Wrong');
    }
  }
}
