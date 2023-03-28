import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Booking } from '@/modules/booking/entities/booking.entity';
import { Role } from '@/modules/role/entities/role.entity';

@Entity({ name: 'users' })
export default class User {
  @ApiProperty({
    example: '1',
    description: 'id of user',
  })
  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'username',
  })
  @Column({
    nullable: false,
  })
  username: string;

  @ApiProperty({
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Column({
    nullable: false,
    unique: true,
    type: 'text',
  })
  email: string;

  @ApiProperty({
    example: 'password-example',
  })
  @Exclude()
  @Column({ type: 'text', nullable: true })
  password?: string;

  @ApiProperty({
    example: 'true',
    description: 'column of the user is active account',
  })
  @Column({ type: 'boolean', name: 'is_active', default: false })
  isActive?: boolean;

  @ApiProperty({
    example: 'false',
    description: 'column of the user is active account',
  })
  @Column({ type: 'boolean', name: 'is_google_account', default: false })
  isGoogleAccount: boolean;

  @ApiProperty({
    example: 'example-token',
    description: ' this is a example but this use uuid v4',
  })
  @IsUUID(4)
  @Exclude()
  @Column({
    type: 'uuid',
    name: 'activation_token',
    unique: true,
    nullable: true,
  })
  activationToken?: string;

  @ApiProperty({
    example: 'example-reset-token',
    description: ' this is a example but this use uuid v4',
  })
  @IsUUID(4)
  @Exclude()
  @Column({
    type: 'uuid',
    unique: true,
    name: 'reset_password_token',
    nullable: true,
  })
  resetPasswordToken?: string;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({
    name: 'role_id',
  })
  role: Role;

  @OneToMany(() => Booking, booking => booking.clientId, { lazy: true })
  booking: Promise<Booking[]>;

  @Column({ name: 'device_token', type: 'varchar', nullable: true })
  deviceToken: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
