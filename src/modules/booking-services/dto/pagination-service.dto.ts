import { IsArray, IsNumber } from 'class-validator';

import { Services } from '../entities/services.entity';

export class PaginatedServicesDto {
  @IsArray()
  data: Services[];
  @IsNumber()
  total: number;

  prevPage: string | null;
  nextPage: string | null;
}
