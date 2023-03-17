import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

@Injectable()
export class Cloudinary {
  static cloudinary = v2;

  constructor(private configService: ConfigService) {
    Cloudinary.cloudinary.config({
      cloud_name: this.configService.get('CLOUD_NAME'),
      api_key: this.configService.get('CLOUD_KEY'),
      api_secret: this.configService.get('CLOUD_SECRET'),
    });
  }
}
