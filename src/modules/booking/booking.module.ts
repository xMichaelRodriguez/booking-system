import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '../auth/entities/auth.entity';
import { Services } from '../booking-services/entities/services.entity';
import { Status } from '../status/entities/status.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Services, Status, User])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
