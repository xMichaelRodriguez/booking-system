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
import { AuthGuard } from '@nestjs/passport';
import { RoleAuthGuard } from 'src/guards/role-auth/role-auth.guard';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { BookingServicesService } from './services.service';

@Controller('services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
  ) {}

  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Post()
  create(@Body() createBookingServiceDto: CreateServiceDto) {
    return this.bookingServicesService.create(createBookingServiceDto);
  }

  @UseGuards(
    AuthGuard(['jwt', 'gogle']),
    new RoleAuthGuard('ADMIN', 'AUTHENTICATED'),
  )
  @Get()
  findAll() {
    return this.bookingServicesService.findAll();
  }

  @UseGuards(
    AuthGuard(['jwt', 'gogle']),
    new RoleAuthGuard('ADMIN', 'AUTHENTICATED'),
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingServicesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingServiceDto: UpdateServiceDto,
  ) {
    return this.bookingServicesService.update(+id, updateBookingServiceDto);
  }

  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingServicesService.remove(+id);
  }
}
