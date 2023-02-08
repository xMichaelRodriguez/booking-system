import { ApiProperty } from '@nestjs/swagger';
import User from 'src/modules/auth/entities/auth.entity';
import { Services } from 'src/modules/booking-services/entities/services.entity';
import { Status } from 'src/modules/status/entities/status.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('booking')
export class Booking {
  @ApiProperty({
    example: '1',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: '1',
  })
  @ManyToOne(() => User, user => user.booking)
  @JoinColumn({
    name: 'client_id',
  })
  clientId: User;

  @ApiProperty({
    example: '1',
  })
  @ManyToMany(() => Services, services => services.booking)
  @JoinTable({
    name: 'service_id',
  })
  serviceId: Services;

  @ApiProperty({
    example: '1',
  })
  @OneToOne(() => Status, status => status.booking)
  @JoinColumn({
    name: 'status_id',
  })
  statusId: Status;

  @ApiProperty({
    example: '01/14/2023',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'date',
    length: 10,
  })
  date: string;

  @ApiProperty({
    example: '12:00 AM',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'hour',
    length: 8,
  })
  hour: string;
}
