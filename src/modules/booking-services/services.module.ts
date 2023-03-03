import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from 'src/config/configuration';

import { Services } from './entities/services.entity';
import { BookingServicesController } from './services.controller';
import { BookingServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services]), HttpModule],
  controllers: [BookingServicesController],
  providers: [BookingServicesService, ConfigurationService],
})
export class ServicesModule {}
