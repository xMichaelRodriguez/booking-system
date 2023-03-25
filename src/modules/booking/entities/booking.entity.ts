import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import User from '@/modules/auth/entities/auth.entity';
import { Services } from '@/modules/booking-services/entities/services.entity';
import { Status } from '@/modules/status/entities/status.entity';

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
    example: 'Example Note ',
  })
  @Column({ type: 'varchar', nullable: true, length: 500 })
  note: string;
  @ApiProperty({
    example: '2023-03-06T01:30Z',
  })
  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'date',
  })
  date: Date;
}
