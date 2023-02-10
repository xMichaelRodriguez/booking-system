import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('services')
export class Services {
  @ApiProperty({
    example: '1',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'example service',
  })
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    example: 'example service description',
  })
  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @ApiProperty({
    example: '20.20',
  })
  @Column({
    type: 'decimal',
    nullable: false,
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @OneToMany(() => Booking, booking => booking.serviceId)
  booking: number;
}
