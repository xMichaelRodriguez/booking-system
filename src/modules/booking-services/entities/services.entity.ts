import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Booking } from '@/modules/booking/entities/booking.entity';

@Entity('services')
export class Services {
  @ApiProperty({
    example: '1',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: '1234455665',
  })
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example:
      'Non excepteur reprehenderit fugiat consequat aliqua sunt Lorem sint non pariatur nostrud excepteur laboris proident.',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'description',
    length: 500,
  })
  description: string;

  @ApiProperty({
    example: 10.3,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'price',
    nullable: false,
  })
  price: string;

  @ApiProperty({
    example: 'https://example.png',
  })
  @Column({
    type: 'varchar',
    name: 'secure_url',
    nullable: false,
  })
  secureUrl: string;

  @ApiProperty({
    example: 'dfukhsfghukdxfbjwefuibdx',
  })
  @Column({
    type: 'varchar',
    name: 'public_id',
    nullable: false,
  })
  publicId: string;

  @OneToMany(() => Booking, booking => booking.serviceId)
  booking: number;
}
