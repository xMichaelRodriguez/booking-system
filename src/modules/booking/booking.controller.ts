import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleAuthGuard } from 'src/guards/role-auth/role-auth.guard';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }
  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }
  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }
  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }
  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
