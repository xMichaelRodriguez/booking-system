import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedConfigService } from 'src/libs/mocks/config.service';
import { mockedJwtService } from 'src/libs/mocks/jwt.service';
import { mockMailService } from 'src/libs/mocks/mail.service';
import { createAuthDto } from 'src/libs/mocks/user.mock';
import { Repository } from 'typeorm';

import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';
import { EncoderService } from './encoder/encoder.service';
import User from './entities/auth.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let mailService: MailService;
  let encoderService: EncoderService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        { provide: JwtService, useValue: mockedJwtService },

        { provide: MailService, useValue: mockMailService },
        EncoderService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mailService = module.get<MailService>(MailService);
    encoderService = module.get<EncoderService>(EncoderService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a new user', async () => {
    jest.spyOn(encoderService, 'encodePassword').mockResolvedValue('hashed');
    jest.spyOn(mailService, 'sendVerificationUsers').mockResolvedValue(null);

    jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      username: 'test',
      password: 'hashed',
      activationToken: expect.any(String),
      isGoogleAccount: false,
    } as User);
    const user = await authService.create(createAuthDto);
    expect(user).toEqual(expect.objectContaining(user));

    expect(encoderService.encodePassword).toHaveBeenCalledWith('test');

    expect(mailService.sendVerificationUsers).toHaveBeenCalledWith(
      expect.objectContaining(
        new User({
          ...user,
        }),
      ),
      expect.any(String),
    );
  });

  it('should throw a ConflictException if the email is already registered', async () => {
    jest.spyOn(encoderService, 'encodePassword').mockResolvedValue('hashed');
    jest.spyOn(mailService, 'sendVerificationUsers').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockRejectedValue({
      code: '23505',
      message: 'This email is already registered',
    });
    try {
      await authService.create(createAuthDto);
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('This email is already registered');
    }
  });

  it('should throw an InternalServerErrorException if an unknown error occurs', async () => {
    jest.spyOn(encoderService, 'encodePassword').mockImplementation(() => {
      throw new Error();
    });

    try {
      await authService.create(createAuthDto);
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });
});
