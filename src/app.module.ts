import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/modules/auth/auth.module';
import { ServicesModule } from '@/modules/booking-services/services.module';
import { BookingModule } from '@/modules/booking/booking.module';
import { MailModule } from '@/modules/mail/mail.module';
import { CloudinaryModule } from '@/modules/media/Cloudinary.module';
import { RoleModule } from '@/modules/role/role.module';
import { StatusModule } from '@/modules/status/status.module';

// import { redisStore } from 'cache-manager-redis-store';

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
              synchronize: false,
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BookingModule,
    CloudinaryModule,
    MailModule,
    RoleModule,
    ServicesModule,
    StatusModule,
  ],
  providers: [],
})
export class AppModule {}
