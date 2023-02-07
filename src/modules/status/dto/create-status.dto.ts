import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({
    example: 'success',
  })
  @IsNotEmpty()
  @Length(3, 12)
  name: string;
}
