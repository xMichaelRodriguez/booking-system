import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { redisStore } from 'cache-manager-redis-store';

import { AuthModule } from './modules/auth/auth.module';
import { BookingServicesModule } from './modules/booking-services/booking-services.module';
import { BookingModule } from './modules/booking/booking.module';
import { MailModule } from './modules/mail/mail.module';
import { RoleModule } from './modules/role/role.module';
import { StatusModule } from './modules/status/status.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    // CacheModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     isGlobal: true,
    //     store: redisStore,
    //     host: configService.get('REDIS_HOST'),
    //     port: +configService.get('REDIS_PORT'),
    //   }),
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        process.env.DATABASE_URL !== undefined
          ? {
              type: 'postgres',
              url: process.env.DATABASE_URL,
              autoLoadEntities: true,
              synchronize: true,
              entities: ['./dist/**/*.entity.js'],
            }
          : {
              type: 'postgres',
              host: configService.get('PG_HOST'),
              port: +configService.get<number>('PG_PORT'),
              username: configService.get<string>('PG_USER'),
              password: configService.get<string>('PG_PASSWORD'),
              database: configService.get<string>('PG_DATABASE'),
              autoLoadEntities: true,
              synchronize: true,
              entities: ['./dist/**/*.entity.js'],
            },
    }),
    AuthModule,
    MailModule,
    RoleModule,
    BookingServicesModule,
    StatusModule,
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
