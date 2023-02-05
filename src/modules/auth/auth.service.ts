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
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { MailService } from '../mail/mail.service';
import { RoleRepositoryService } from '../role/role-repository.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EncoderService } from './encoder/encoder.service';
import User from './entities/auth.entity';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private userReposity: Repository<User>,

    private readonly roleRepository: RoleRepositoryService,

    private encoderService: EncoderService,

    private jwtService: JwtService,

    private mailService: MailService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    try {
      const { password } = createAuthDto;
      const plainTextToHash = await this.encoderService.encodePassword(
        password,
      );

      const role = await this.roleRepository.getDefaultRole();
      const user = await this.userReposity.create({
        ...createAuthDto,
        password: plainTextToHash,
        activationToken: v4(),
        role,
      });
      const userSaved = await this.userReposity.save(user);
      await this.mailService.sendVerificationUsers(user, user.activationToken);
      return new User(userSaved);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('This email is already registered');

      this.logger.debug(error);

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.findByEmail(loginAuthDto.email);

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
    const accessToken = this.jwtService.sign(payload);

    return {
      user: new User(user),
      jwt: { accessToken },
    };
  }

  async activateUser(activateUserDto: ActivateUserDto): Promise<void> {
    const { id, code } = activateUserDto;
    const user: User = await this.findOneInactiveByIdActivationToken(+id, code);
    if (!user)
      throw new UnprocessableEntityException('This action can not be done');

    await this.userReposity.update(user.id, {
      ...user,
      isActive: true,
      activationToken: null,
    });
  }

  async findOneInactiveByIdActivationToken(id: number, code: string) {
    return await this.userReposity.findOne({
      where: { id, activationToken: code, isActive: false },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user: User = await this.userReposity.findOne({
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
    const user: User = await this.findByEmail(email);

    this.userReposity.update(
      user.id,

      { ...user, resetPasswordToken: v4() },
    );
    // send email(e.g Dispatch an event so MailerModule can send the email  )
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { resetPasswordToken, password } = resetPasswordDto;
    const user: User = await this.findOneByResetPasswordToken(
      resetPasswordToken,
    );

    const newPassword = await this.encoderService.encodePassword(password);

    this.userReposity.update(user.id, {
      ...user,
      password: newPassword,
      resetPasswordToken: null,
    });
  }

  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<User> {
    const user: User = await this.userReposity.findOne({
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
    await this.userReposity.update(user.id, {
      ...user,
      password: hashPassword,
    });
  }
}
