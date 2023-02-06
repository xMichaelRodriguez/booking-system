import { IsDecimal, Length } from 'class-validator';

export class CreateServiceDto {
  @Length(3, 100)
  name: string;

  @Length(50, 500)
  description: string;

  @IsDecimal({
    decimal_digits: '2',
  })
  price: number;
}
