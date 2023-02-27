import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({
    example: 1,
  })
  stateId: number;
}
