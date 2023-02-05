import User from 'src/modules/auth/entities/auth.entity';
import { BookingService } from 'src/modules/booking-services/entities/booking-service.entity';
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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, user => user.booking)
  @JoinColumn({
    name: 'client_id',
  })
  clientId: User;

  @OneToOne(() => BookingService, booKingservice => booKingservice.booking)
  @JoinColumn({
    name: 'service_id',
  })
  serviceId: BookingService;

  @OneToOne(() => Status, status => status.booking)
  @JoinColumn({
    name: 'status_id',
  })
  statusId: Status;
}
