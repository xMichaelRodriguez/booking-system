import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('status')
export class Status {
  @ApiProperty({
    example: '1',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'success',
  })
  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => Booking, booking => booking.statusId)
  booking: number;
}
