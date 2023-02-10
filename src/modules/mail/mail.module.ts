import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('SG_MAIL_HOST'),
          secure: false,
          port: config.get('SG_MAIL_PORT'),
          auth: {
            user: config.get('SG_MAIL_USER'),
            pass: config.get('SG_MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('SG_MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
