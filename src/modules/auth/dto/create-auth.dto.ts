import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { LoginAuthDto } from './login-auth.dto';

export class CreateAuthDto extends PartialType(LoginAuthDto) {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;
}
