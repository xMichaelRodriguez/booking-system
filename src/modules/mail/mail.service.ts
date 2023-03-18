import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { ConfigurationService } from '@/config/configuration';
import User from '@/modules/auth/entities/auth.entity';

@Injectable()
export class MailService {
  #logger = new Logger(MailService.name);
  constructor(private mailerService: MailerService) {}

  async sendVerificationUsers(user: User, token: string) {
    const configService = new ConfigurationService();
    const url = `${configService.getapiBaseUrl()}/auth/activate-accounts/?id=${
      user.id
    }&code=${token}`;
    const sendMailOptions = {
      from: configService.getSender(),
      to: user.email,
      subject: 'Welcome to Mi application; Confirm Your Account!',
      template: './transactional',
      context: {
        name: user.username,
        url,
      },
    };

    try {
      this.#logger.debug('MAIL SEND');
      await this.mailerService.sendMail(sendMailOptions);
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException(
        'error trying sent mail verification',
      );
    }
  }
  async sendResetPassword(user: User, token: string) {
    const configService = new ConfigurationService();
    const url = `${configService.getapiBaseUrl()}/auth/reset-password/${token}`;
    const sendMailOptions = {
      from: configService.getSender(),
      to: user.email,
      subject: 'Your Candy Cake password',
      template: './reset-password',
      context: {
        name: user.username,
        url,
      },
    };

    try {
      this.#logger.debug('MAIL SEND');
      await this.mailerService.sendMail(sendMailOptions);
    } catch (error) {
      this.#logger.error(error);
      throw new InternalServerErrorException(
        'error trying sent mail verification',
      );
    }
  }
}
