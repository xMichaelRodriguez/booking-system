import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
    const service = this.servicesRepository.create(createBookingServiceDto);

    try {
      return await this.servicesRepository.save(service);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('This service is already registered');

      this.#logger.error(error.message);

      throw new InternalServerErrorException('Error creating Service');
    }
  }

  findAll() {
    return `This action returns all bookingServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookingService`;
  }

  update(id: number, updateBookingServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} bookingService ${updateBookingServiceDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookingService`;
  }
}
