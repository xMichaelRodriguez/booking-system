import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigurationService } from 'src/config/configuration';

import User from '../auth/entities/auth.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationUsers(user: User, token: string) {
    const configService = new ConfigurationService();
    const url = `${configService.getapiBaseUrl()}/api/v1/auth/activate-accounts/?id=${
      user.id
    }&code=${token}`;
    const sendMailOptions = {
      to: user.email,
      subject: 'Welcome to Mikey.dev; Confirm Your Account!',
      template: './transactional',
      context: {
        name: user.username,
        url,
      },
    };
    await this.mailerService.sendMail(sendMailOptions);
  }
}
