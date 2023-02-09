import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Services } from './entities/services.entity';
import { BookingServicesController } from './services.controller';
import { BookingServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services])],
  controllers: [BookingServicesController],
  providers: [BookingServicesService],
})
export class ServicesModule {}
