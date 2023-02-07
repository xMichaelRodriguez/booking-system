import { ApiProperty } from '@nestjs/swagger';
import User from 'src/modules/auth/entities/auth.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @ApiProperty({
    example: '1',
  })
  @PrimaryGeneratedColumn('increment')
  @OneToMany(() => User, user => user.role)
  id: number;

  @ApiProperty({ example: 'admin' })
  @Column({
    length: 100,
    nullable: false,
    type: 'varchar',
    unique: true,
  })
  name: string;

  @Column({
    length: 200,
    nullable: true,
    type: 'varchar',
  })
  @ApiProperty({ example: 'admin description role' })
  description: string;

  @ApiProperty({ example: '[1,2,3,4]' })
  @OneToMany(() => User, user => user.role)
  users?: User;
}
