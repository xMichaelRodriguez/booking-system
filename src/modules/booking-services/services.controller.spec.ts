import { Test, TestingModule } from '@nestjs/testing';

import { BookingServicesController } from './services.controller';
import { BookingServicesService } from './services.service';

describe('BookingServicesController', () => {
  let controller: BookingServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingServicesController],
      providers: [BookingServicesService],
    }).compile();

    controller = module.get<BookingServicesController>(
      BookingServicesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
