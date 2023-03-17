import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common/pipes/file';
import { Logger } from '@nestjs/common/services';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ConfigurationService } from '@/config/configuration';
import { FILE_SIZE } from '@/enums/file-size';
import { RoleAuthGuard } from '@/guards/role-auth/role-auth.guard';
import { PaginationQueryDto } from '@/interfaces/pagination-query.dto';
import { FileRequiredPipePipe } from '@/pipes/file-required-pipe.pipe';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from './entities/services.entity';
import { BookingServicesService } from './services.service';

@ApiBearerAuth()
@ApiTags('Services')
@Controller('services')
export class BookingServicesController {
  #logger = new Logger(BookingServicesController.name);
  constructor(
    private readonly bookingServicesService: BookingServicesService,
    private readonly configService: ConfigurationService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Uptade service',
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
        message: 'Error trying to update image of services',
        error: 'InternalServerError',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'id service',
    example: 1,
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(
      new FileRequiredPipePipe(),
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_SIZE }),
          new FileTypeValidator({ fileType: /(gif|jpeg|png|jpg)/gi }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<Services> {
    return this.bookingServicesService.create(file, createServiceDto);
  }

  @ApiOkResponse({
    description: 'Uptade service',
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
        message: 'Error trying to update image of services',
        error: 'InternalServerError',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'id service',
    example: 1,
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<void> {
    return this.bookingServicesService.update(+id, updateServiceDto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Uptade image of service',
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
        message: 'Error trying to update image of services',
        error: 'InternalServerError',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'id service',
    example: 1,
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Patch('/:id/images')
  @UseInterceptors(FileInterceptor('image'))
  async updateimage(
    @Param('id') id: string,
    @UploadedFile(
      new FileRequiredPipePipe(),
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_SIZE }),
          new FileTypeValidator({ fileType: /(gif|jpeg|png|jpg)/gi }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    return this.bookingServicesService.updateImage(+id, file);
  }

  @ApiOkResponse({
    description: 'Uptade image of service',
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
        message: 'Error trying to update image of services',
        error: 'InternalServerError',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'id service',
    example: 1,
  })
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN'))
  @Delete('/:id')
  async removeItem(@Param('id') id: string) {
    return this.bookingServicesService.deleteProduct(+id);
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
  @UseGuards(AuthGuard('jwt'), new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingServicesService.findOne(+id);
  }
}
