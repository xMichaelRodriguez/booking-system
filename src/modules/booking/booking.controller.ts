import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { Logger } from '@nestjs/common/services';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleAuthGuard } from 'src/guards/role-auth/role-auth.guard';
import { IFilterParams } from 'src/interfaces/filter.interface';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('bookings')
export class BookingController {
  #logger = new Logger(BookingController.name);
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('AUTHENTICATED'))
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    const { hour, date } = createBookingDto;

    const newHour = new Date(hour);
    const newDate = new Date(date);
    const processedTime = new Intl.DateTimeFormat('en-us', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(newHour);

    const processedDate = new Intl.DateTimeFormat('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(newDate);

    return this.bookingService.create(
      createBookingDto,
      processedTime,
      processedDate,
    );
  }

  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get()
  findAll(@Query() params: IFilterParams) {
    return this.bookingService.findAll(params);
  }
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
