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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, user => user.booking)
  @JoinColumn({
    name: 'client_id',
  })
  clientId: User;

  @OneToOne(() => Services, services => services.booking)
  @JoinColumn({
    name: 'service_id',
  })
  serviceId: Services;

  @OneToOne(() => Status, status => status.booking)
  @JoinColumn({
    name: 'status_id',
  })
  statusId: Status;
}
