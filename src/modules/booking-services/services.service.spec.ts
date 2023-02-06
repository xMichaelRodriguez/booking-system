import { Test, TestingModule } from '@nestjs/testing';

import { BookingServicesService } from './services.service';

describe('BookingServicesService', () => {
  let service: BookingServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingServicesService],
    }).compile();

    service = module.get<BookingServicesService>(BookingServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
