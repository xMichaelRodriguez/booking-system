import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { BookingServicesService } from './booking-services.service';
import { CreateBookingServiceDto } from './dto/create-booking-service.dto';
import { UpdateBookingServiceDto } from './dto/update-booking-service.dto';

@Controller('booking-services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
  ) {}

  @Post()
  create(@Body() createBookingServiceDto: CreateBookingServiceDto) {
    return this.bookingServicesService.create(createBookingServiceDto);
  }

  @Get()
  findAll() {
    return this.bookingServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingServicesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingServiceDto: UpdateBookingServiceDto,
  ) {
    return this.bookingServicesService.update(+id, updateBookingServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingServicesService.remove(+id);
  }
}
