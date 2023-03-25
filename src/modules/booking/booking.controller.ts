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
import { Logger } from '@nestjs/common/services';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleAuthGuard } from '@/guards/role-auth/role-auth.guard';
import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import User from '@/modules/auth/entities/auth.entity';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateStateBookingDto } from './dto/update-state-booking.dto';
import { Booking } from './entities/booking.entity';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('bookings')
export class BookingController {
  #logger = new Logger(BookingController.name);
  constructor(private readonly bookingService: BookingService) {}

  @ApiCreatedResponse({
    description: 'Booking Created',
    type: Booking,
  })
  @ApiConflictResponse({
    schema: {
      example: {
        statusCode: 409,
        message:
          'A reservation already exists for the time you are trying to book',
        error: 'ConflicException',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying create booking',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @ApiOkResponse({
    description: 'List bookings',
    isArray: true,
    type: Booking,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying find bookings',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get()
  findAll(@GetUser() user: User) {
    return this.bookingService.findAll(user);
  }

  @ApiOkResponse({
    description: 'update booking',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying update booking',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Patch('/:id/update-states')
  updateStateBooking(
    @Param('id') id: string,
    @Body() updateStateBookingDto: UpdateStateBookingDto,
  ) {
    return this.bookingService.updateStateBooking(
      +id,
      updateStateBookingDto.stateId,
    );
  }

  @ApiOkResponse({
    description: 'Delete Booking',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying delete booking',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
