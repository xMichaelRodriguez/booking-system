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
    type: () => User,
  })
  @ManyToOne(() => User, user => user.booking)
  @JoinColumn({
    name: 'client_id',
  })
  clientId: User;

  @ApiProperty({
    type: () => Services,
  })
  @ManyToOne(() => Services, services => services.booking)
  @JoinColumn({
    name: 'service_id',
  })
  serviceId: Services;

  @ApiProperty({
    type: () => Status,
  })
  @ManyToOne(() => Status, status => status.booking)
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
