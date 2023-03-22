import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Cloudinary } from './cloudinary';
import { CloudinaryService } from './Cloudinary.service';

describe('Cloudinary', () => {
  let provider: Cloudinary;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService, ConfigService, Cloudinary],
      exports: [CloudinaryService, Cloudinary],
    }).compile();

    provider = module.get<Cloudinary>(Cloudinary);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
