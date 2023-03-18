import { Module } from '@nestjs/common';

import { CloudinaryService } from '@/modules/media/Cloudinary.service';

import { Cloudinary } from './cloudinary';

@Module({
  providers: [CloudinaryService, Cloudinary],
  exports: [CloudinaryService, Cloudinary],
})
export class CloudinaryModule {}
