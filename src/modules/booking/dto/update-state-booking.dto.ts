import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateStateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  stateId: number;
}
