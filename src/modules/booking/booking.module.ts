import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '@/modules/auth/entities/auth.entity';
import { Services } from '@/modules/booking-services/entities/services.entity';
import { Role } from '@/modules/role/entities/role.entity';
import { RoleModule } from '@/modules/role/role.module';
import { RoleService } from '@/modules/role/role.service';
import { Status } from '@/modules/status/entities/status.entity';

import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Services, Status, User, Role]),
    RoleModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, RoleService, NotificationService],
})
export class BookingModule {}
