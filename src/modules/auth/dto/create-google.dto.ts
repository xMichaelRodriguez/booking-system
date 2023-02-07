import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateGoogleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Required username' })
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Required email' })
  @IsEmail()
  email: string;
}
