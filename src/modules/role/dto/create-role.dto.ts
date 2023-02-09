import { IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({
    message: 'required name',
  })
  @Length(4, 10)
  name: string;

  @IsNotEmpty({
    message: 'required description',
  })
  @Length(4, 500)
  description: string;
}
