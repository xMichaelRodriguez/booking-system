import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from './entities/services.entity';

@Injectable()
export class BookingServicesService {
  #logger = new Logger(BookingServicesService.name);
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
  ) {}
  async create(createBookingServiceDto: CreateServiceDto) {
    const serviceToSave = this.servicesRepository.create(
      createBookingServiceDto,
    );
    try {
      return await this.servicesRepository.save(serviceToSave);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('This service is already registered');

      this.#logger.error(error.message);

      throw new InternalServerErrorException('Error creating Service');
    }
  }

  async findAll() {
    try {
      return await this.servicesRepository.find();
    } catch (error) {
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

  async update(id: number, updateBookingServiceDto: UpdateServiceDto) {
    await this.findOne(id);
    try {
      await this.servicesRepository
        .createQueryBuilder()
        .update(Services)
        .set(updateBookingServiceDto)
        .where('id=:id', { id })
        .execute();
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying update service');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      await this.servicesRepository
        .createQueryBuilder('services')
        .delete()
        .from(Services)
        .where('id=:id', { id })
        .execute();
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying remove service');
    }
  }
}
