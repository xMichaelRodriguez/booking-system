import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('status')
export class Status {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
  })
  name: string;

  @OneToOne(() => Booking, booking => booking.statusId)
  booking: number;
}
