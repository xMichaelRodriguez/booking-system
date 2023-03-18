import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderType } from '@/enums/sort-enum';

import { CloudinaryService } from '../media/Cloudinary.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginatedServicesDto } from './dto/pagination-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from './entities/services.entity';

@Injectable()
export class BookingServicesService {
  #logger = new Logger(BookingServicesService.name);
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    file: Express.Multer.File,
    createServiceDto: CreateServiceDto,
  ): Promise<Services> {
    let publicId: string;
    try {
      const { secure_url, public_id } =
        await this.cloudinaryService.uploadImage(file);

      const secureUrl: string = secure_url;
      publicId = public_id;
      const serviceParsed = {
        ...createServiceDto,
        secureUrl,
        publicId,
      };
      const serviceToSave = this.servicesRepository.create(serviceParsed);

      return await this.servicesRepository.save(serviceToSave);
    } catch (error) {
      this.#logger.error(error.message);

      // If the error is an HttpException, it means it was thrown by Nest
      // so we don't need to delete the image since it was never uploaded
      if (error instanceof HttpException)
        throw new InternalServerErrorException(error.message);

      // If the error is not an HttpException, it means it was thrown by Cloudinary
      // so we need to delete the image since it was uploaded successfully
      await this.cloudinaryService.removeImage(publicId);

      throw new InternalServerErrorException('Error trying create service');
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      await this.findOne(id);
      await this.servicesRepository
        .createQueryBuilder()
        .update()
        .set(updateServiceDto)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying to update service');
    }
  }

  async updateImage(id: number, file: Express.Multer.File) {
    let publicId: string;
    try {
      const service = await this.findOne(id);
      await this.cloudinaryService.removeImage(service.publicId);

      const { secure_url, public_id } =
        await this.cloudinaryService.uploadImage(file);

      const secureUrl: string = secure_url;
      publicId = public_id;

      const serviceParsed = {
        secureUrl,
        publicId,
      };
      await this.servicesRepository
        .createQueryBuilder()
        .update()
        .set(serviceParsed)
        .where('id := id', { id })
        .execute();
    } catch (error) {
      this.#logger.error(error.message);

      // If the error is an HttpException, it means it was thrown by Nest
      // so we don't need to delete the image since it was never uploaded
      if (error instanceof HttpException) throw error;

      // If the error is not an HttpException, it means it was thrown by Cloudinary
      // so we need to delete the image since it was uploaded successfully
      await this.cloudinaryService.removeImage(publicId);

      throw new InternalServerErrorException(
        'Error trying to update Image of service',
      );
    }
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
        .orderBy('services.name', order)
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

  async deleteProduct(id: number) {
    try {
      const service = await this.findOne(id);
      await this.cloudinaryService.removeImage(service.publicId);
      await this.servicesRepository
        .createQueryBuilder()
        .delete()
        .from(Services)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      this.#logger.error(error.messge);
      throw new InternalServerErrorException('error trying delete Data');
    }
  }
}
