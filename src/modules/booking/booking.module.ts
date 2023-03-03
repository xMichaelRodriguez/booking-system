import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '../auth/entities/auth.entity';
import { Services } from '../booking-services/entities/services.entity';
import { Role } from '../role/entities/role.entity';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { Status } from '../status/entities/status.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Services, Status, User, Role]),
    RoleModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, RoleService],
})
export class BookingModule {}
