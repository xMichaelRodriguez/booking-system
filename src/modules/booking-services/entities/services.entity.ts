import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('services')
export class Services {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({
    type: 'decimal',
    nullable: false,
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @OneToOne(() => Booking, booking => booking.serviceId)
  booking: number;
}
