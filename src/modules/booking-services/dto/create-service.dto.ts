import { IsDecimal, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @Length(3, 100)
  @IsString()
  name: string;

  @IsNotEmpty()
  @Length(50, 500)
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDecimal({
    decimal_digits: '2',
  })
  price: number;
}
