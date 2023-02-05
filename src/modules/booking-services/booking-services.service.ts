import { Injectable } from '@nestjs/common';

import { CreateBookingServiceDto } from './dto/create-booking-service.dto';
import { UpdateBookingServiceDto } from './dto/update-booking-service.dto';

@Injectable()
export class BookingServicesService {
  create(createBookingServiceDto: CreateBookingServiceDto) {
    return `This action adds a new bookingService${createBookingServiceDto}`;
  }

  findAll() {
    return `This action returns all bookingServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookingService`;
  }

  update(id: number, updateBookingServiceDto: UpdateBookingServiceDto) {
    return `This action updates a #${id} bookingService ${updateBookingServiceDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookingService`;
  }
}
