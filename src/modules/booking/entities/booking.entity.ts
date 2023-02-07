import { ApiProperty } from '@nestjs/swagger';
import User from 'src/modules/auth/entities/auth.entity';
import { Services } from 'src/modules/booking-services/entities/services.entity';
import { Status } from 'src/modules/status/entities/status.entity';
import {
  Entity,
  JoinColumn,
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
  @OneToOne(() => Services, services => services.booking)
  @JoinColumn({
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
}
