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
    example: '1234455665',
  })
  @Column({ name: 'ig_post_id', type: 'varchar', nullable: false })
  igPostId: number;

  @ApiProperty({
    example: 'https://example.com',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'media_url',
  })
  mediaUrl: string;

  @ApiProperty({
    example: 'example service description',
  })
  @Column({ type: 'varchar', name: 'caption', nullable: true })
  caption: string;

  @ApiProperty({
    example: 'https://example.com',
  })
  @OneToMany(() => Booking, booking => booking.serviceId)
  booking: number;
}
