import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({
    message: 'required service',
  })
  @IsNumber()
  serviceId: number;

  @IsNotEmpty({
    message: 'required client',
  })
  @IsNumber()
  clientId: number;

  @IsNotEmpty({
    message: 'required state',
  })
  @IsNumber()
  stateId: number;

  @IsISO8601()
  date: Date;

  @IsISO8601()
  hour: Date;
}
