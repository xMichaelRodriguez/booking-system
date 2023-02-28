import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigurationService } from 'src/config/configuration';
import { RoleAuthGuard } from 'src/guards/role-auth/role-auth.guard';

import { PaginationQueryDto } from '../../interfaces/pagination-query.dto';
import { Services } from './entities/services.entity';
import { BookingServicesService } from './services.service';

@ApiBearerAuth()
@ApiTags('Services')
@Controller('services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
    private readonly configService: ConfigurationService,
  ) {}

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
  async findAll(@Query() pagination: PaginationQueryDto) {
    const { page, limit, order } = pagination;
    const apiBaseUrl = this.configService.getapiBaseUrl();

    const paginatedServices = await this.bookingServicesService.paginate(
      page,
      limit,
      order,
      apiBaseUrl,
    );

    return paginatedServices;
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
}
