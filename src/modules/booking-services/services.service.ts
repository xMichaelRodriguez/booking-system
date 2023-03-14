import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigurationService } from 'src/config/configuration';
import { Repository } from 'typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { PaginatedServicesDto } from './dto/pagination-service.dto';
import { Services } from './entities/services.entity';
import { OrderType } from './enums/sort-enum';

@Injectable()
export class BookingServicesService {
  #logger = new Logger(BookingServicesService.name);
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService,
  ) {}

  async create(file: Express.Multer.File, createServiceDto: CreateServiceDto) {
    return {
      ...createServiceDto,
      image: file.originalname,
    };
  }
  async paginate(
    page: number,
    limit: number,
    order: OrderType,
    apiBaseUrl: string,
  ): Promise<PaginatedServicesDto> {
    try {
      const offset = (page - 1) * limit;

      const [data, total] = await this.servicesRepository
        .createQueryBuilder('services')
        .orderBy('services.caption', order)
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      const nextPage =
        total > offset + limit
          ? `${apiBaseUrl}/services?page=${page + 1}&limit=${limit}`
          : null;
      const prevPage =
        offset > 0
          ? `${apiBaseUrl}/services?page=${page - 1}&limit=${limit}`
          : null;
      return { data, total, prevPage, nextPage };
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying search services');
    }
  }

  async findOne(id: number) {
    const service = await this.servicesRepository
      .createQueryBuilder('services')
      .where('id=:id', { id })
      .getOne();

    if (!service) throw new NotFoundException('Service not found');

    return service;
  }

  async deleteProducts() {
    try {
      await this.servicesRepository
        .createQueryBuilder()
        .delete()
        .from(Services)
        .execute();

      this.#logger.debug('DATA REMOVED');
    } catch (error) {
      this.#logger.error(error.messge);
      throw new InternalServerErrorException('error trying delete Data');
    }
  }
}
