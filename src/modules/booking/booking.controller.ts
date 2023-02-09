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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiCreatedResponse({
    description: 'Booking Created',
    schema: {
      example: {
        id: 1,
        client: {
          id: 1,
          username: 'John Doe',
          email: 'johndoe@doe.com',
          isActive: true,
          isGoogleAccount: false,
          role: {
            id: 22,
            name: 'example',
            description: 'the example role can realize all operations ',
          },
        },
        serviceId: {
          id: 1,
          name: 'example service',
          description: 'example service description',
          price: 20.2,
        },
        stateId: {
          id: 1,
          name: 'success',
        },
        date: '/01/013/2023',
        hour: '10:00 AM',
      },
    },
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
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('AUTHENTICATED'))
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    const { processedDate, processedTime } =
      this.bookingService.processedDateAndHour(createBookingDto);

    return this.bookingService.create(
      createBookingDto,
      processedTime,
      processedDate,
    );
  }

  @ApiOkResponse({
    description: 'List bookings',
    isArray: true,

    schema: {
      example: {
        id: 1,
        client: {
          id: 1,
          username: 'John Doe',
          email: 'johndoe@doe.com',
          isActive: true,
          isGoogleAccount: false,
          role: {
            id: 22,
            name: 'example',
            description: 'the example role can realize all operations ',
          },
        },
        serviceId: {
          id: 1,
          name: 'example service',
          description: 'example service description',
          price: 20.2,
        },
        stateId: {
          id: 1,
          name: 'success',
        },
        date: '/01/013/2023',
        hour: '10:00 AM',
      },
    },
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
  findAll(@Query() params: IFilterParams) {
    return this.bookingService.findAll(params);
  }

  @ApiOkResponse({
    description: 'List bookings',

    schema: {
      example: {
        id: 1,
        client: {
          id: 1,
          username: 'John Doe',
          email: 'johndoe@doe.com',
          isActive: true,
          isGoogleAccount: false,
          role: {
            id: 22,
            name: 'example',
            description: 'the example role can realize all operations ',
          },
        },
        serviceId: {
          id: 1,
          name: 'example service',
          description: 'example service description',
          price: 20.2,
        },
        stateId: {
          id: 1,
          name: 'success',
        },
        date: '/01/013/2023',
        hour: '10:00 AM',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying find booking',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
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
    const { processedDate, processedTime } =
      this.bookingService.processedDateAndHour(updateBookingDto);
    return this.bookingService.update(
      +id,
      updateBookingDto,
      processedTime,
      processedDate,
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
