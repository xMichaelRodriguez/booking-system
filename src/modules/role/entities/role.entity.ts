import User from 'src/modules/auth/entities/auth.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  @OneToMany(() => User, user => user.role)
  id: number;

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
  description: string;

  @OneToMany(() => User, user => user.role)
  users?: User;
}
