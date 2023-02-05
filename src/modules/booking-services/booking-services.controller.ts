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

import { BookingServicesService } from './booking-services.service';
import { CreateBookingServiceDto } from './dto/create-booking-service.dto';
import { UpdateBookingServiceDto } from './dto/update-booking-service.dto';

@Controller('booking-services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
  ) {}

  @UseGuards(new RoleAuthGuard('ADMIN'))
  @Post()
  create(@Body() createBookingServiceDto: CreateBookingServiceDto) {
    return this.bookingServicesService.create(createBookingServiceDto);
  }

  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get()
  findAll() {
    return this.bookingServicesService.findAll();
  }

  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingServicesService.findOne(+id);
  }

  @UseGuards(new RoleAuthGuard('ADMIN'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingServiceDto: UpdateBookingServiceDto,
  ) {
    return this.bookingServicesService.update(+id, updateBookingServiceDto);
  }

  @UseGuards(new RoleAuthGuard('ADMIN'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingServicesService.remove(+id);
  }
}
