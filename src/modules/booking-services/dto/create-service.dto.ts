import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'example service',
  })
  @IsString()
  @IsNotEmpty({ message: 'Required Name' })
  @Length(3, 100)
  name: string;

  @ApiProperty({
    example: 'example description of service',
  })
  @IsNotEmpty()
  @Length(50, 500)
  @IsString()
  description: string;

  @ApiProperty({
    example: '10.20',
  })
  @IsDecimal({ decimal_digits: '2' })
  price: string;
}
