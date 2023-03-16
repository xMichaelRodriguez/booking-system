import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  resetPasswordToken: string;

  @ApiProperty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[-_*.])[A-Za-z\d-_*.]{8,16}$/, {
    message:
      'Please choose a more secure password that includes at least one uppercase letter, at least one lowercase letter, at least one of the following special characters: [-, _, *, .] and a length between 8 and 16 characters.',
  })
  password: string;
}
