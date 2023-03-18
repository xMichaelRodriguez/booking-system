import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigurationService } from '@/config/configuration';
import { CloudinaryModule } from '@/modules/media/Cloudinary.module';

import { CloudinaryService } from '../media/Cloudinary.service';
import { Services } from './entities/services.entity';
import { BookingServicesController } from './services.controller';
import { BookingServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services]), CloudinaryModule],
  controllers: [BookingServicesController],
  providers: [BookingServicesService, ConfigurationService, CloudinaryService],
})
export class ServicesModule {}
