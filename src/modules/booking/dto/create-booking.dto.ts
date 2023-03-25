import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateBookingDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({
    message: 'required service',
  })
  @IsNumber()
  serviceId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({
    message: 'required client',
  })
  @IsNumber()
  clientId: number;

  @ApiProperty({ example: 'note example' })
  @IsOptional()
  note: string;

  @IsOptional()
  @ApiProperty({
    example: '2022-05-12T12:00:00',
  })
  @IsISO8601()
  date: string;
}
