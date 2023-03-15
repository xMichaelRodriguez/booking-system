import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { OrderType } from 'src/enums/sort-enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Min(1)
  @Max(50)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly limit: number = 10;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly offset: number;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    default: 'ASC',
  })
  @IsString()
  @IsOptional()
  readonly order?: OrderType = OrderType.ASC;
}
