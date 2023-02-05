import { PartialType } from '@nestjs/swagger';

import { CreateBookingServiceDto } from './create-booking-service.dto';

export class UpdateBookingServiceDto extends PartialType(
  CreateBookingServiceDto,
) {}
