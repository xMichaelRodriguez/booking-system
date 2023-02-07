/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { JwtService } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { MailService } from '../mail/mail.service';
import { Role } from '../role/entities/role.entity';
import { RoleModule } from '../role/role.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { EncoderService } from './encoder/encoder.service';
import User from './entities/auth.entity';

interface IUser {
  id: number;
  username: string;
  email: string;
}
describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        RoleModule,
        TypeOrmModule.forFeature([Role]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: User,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: Role,
        },
        EncoderService,
        JwtService,
        { provide: MailService, useValue: {} },
        {
          provide: AuthGuard,
          useFactory: () => {
            return () => AuthGuard();
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token and user data on successful login', async () => {
    const loginAuthDto = { email: 'test@example.com', password: 'test' };
    const user = {
      id: 1,
      username: 'test',
      email: 'test@example.com',
      isGoogleAccount: false,
    } as User;

    const accessToken = 'test-token';
    jest.spyOn(service, 'login').mockImplementation(
      async () =>
        new Promise((resolve, _reject) =>
          resolve({
            user: { ...user, isActive: true },
            jwt: { accessToken },
          }),
        ),
    );

    const result = await controller.login(loginAuthDto);

    expect(result).toEqual({
      user: { ...user, isActive: true },
      jwt: { accessToken },
    });
  });

  it('should create a new user', async () => {
    const createAuthDto = new CreateAuthDto({
      username: 'test',
      email: 'test@example.com',
      password: 'test',
    });
    const user = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      isActive: true,
      isRegisteredWithGoogle: false,
    };
    jest
      .spyOn(service, 'create')
      .mockImplementation(
        async () =>
          new Promise((resolve, _reject) =>
            resolve(expect.objectContaining(user)),
          ),
      );

    const result = await controller.create(createAuthDto);

    expect(result).toEqual(user);
  });

  it('should request a password reset', async () => {
    const requestResetPasswordDto: RequestResetPasswordDto = {
      email: 'test@example.com',
    };
    jest
      .spyOn(service, 'requestResetPassword')
      .mockImplementation(async () => {});

    await controller.requestResetPassword(requestResetPasswordDto);

    expect(service.requestResetPassword).toHaveBeenCalledWith(
      requestResetPasswordDto,
    );
  });
});
