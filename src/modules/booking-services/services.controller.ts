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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleAuthGuard } from 'src/guards/role-auth/role-auth.guard';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from './entities/services.entity';
import { BookingServicesService } from './services.service';

@ApiBearerAuth()
@ApiTags('Services')
@Controller('services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
  ) {}

  @ApiCreatedResponse({
    description: 'Service Created',
    type: Services,
  })
  @ApiConflictResponse({
    schema: {
      example: {
        statusCode: 409,
        message: 'This service is already registered',
        error: 'ConflictException',
      },
    },
    description: 'Conflict Exception',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error creating service',
        error: 'InternalServerError',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Forbbiden Role',
        error: 'ForbbidenException',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Post()
  create(@Body() createBookingServiceDto: CreateServiceDto) {
    return this.bookingServicesService.create(createBookingServiceDto);
  }

  @ApiOkResponse({
    description: 'List Services',
    type: Services,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Forbbiden Role',
        error: 'ForbbidenException',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying search services',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get()
  findAll() {
    return this.bookingServicesService.findAll();
  }

  @ApiOkResponse({
    description: 'list a Service',
    type: Services,
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbbiden Role',
        error: 'ForbbidenException',
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Service Not Foud',
        error: 'NotFoundException',
      },
    },
  })
  @UseGuards(AuthGuard(['jwt']), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingServicesService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'Update a service',
    type: Services,
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbbiden Role',
        error: 'ForbbidenException',
      },
    },
    description: 'Forbbiden Role',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying update service',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingServiceDto: UpdateServiceDto,
  ) {
    return this.bookingServicesService.update(+id, updateBookingServiceDto);
  }

  @ApiOkResponse({
    description: 'Delete a service',
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbbiden Role',
        error: 'ForbbidenException',
      },
    },
    description: 'Forbbiden Role',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Error trying remove service',
        error: 'InternalServerError',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingServicesService.remove(+id);
  }
}
