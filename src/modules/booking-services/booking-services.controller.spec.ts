import { Test, TestingModule } from '@nestjs/testing';

import { BookingServicesController } from './booking-services.controller';
import { BookingServicesService } from './booking-services.service';

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
