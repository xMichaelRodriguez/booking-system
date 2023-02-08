import { Injectable, Logger } from '@nestjs/common';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { IFilterParams } from 'src/interfaces/filter.interface';
import { Repository } from 'typeorm';

import User from '../auth/entities/auth.entity';
import { Services } from '../booking-services/entities/services.entity';
import { Status } from '../status/entities/status.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  #logger = new Logger(BookingService.name);
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}
  async create(
    createBookingDto: CreateBookingDto,
    processedTime: string,
    processedDate: string,
  ) {
    const booking = {
      ...createBookingDto,
      date: processedDate,
      hour: processedTime,
    };

    const { client, service, status } = await this.findServiceClientStatus(
      booking.serviceId,
      booking.clientId,
      booking.stateId,
    );

    const bookingToSave = this.bookingRepository.create({
      ...booking,
      clientId: new User(client),
      serviceId: service,
      statusId: status,
    });

    try {
      return await this.bookingRepository.save(bookingToSave);
    } catch (error) {
      this.#logger.error(error.message);

      throw new InternalServerErrorException('Error creating booking');
    }
  }

  async findServiceClientStatus(
    serviceId: number,
    clientId: number,
    stateId: number,
  ): Promise<{ service: Services; client: User; status: Status }> {
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
    });

    if (!service) throw new NotFoundException('Service not found');

    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });

    if (!client) throw new NotFoundException('Client not found');

    const status = await this.statusRepository.findOne({
      where: { id: stateId },
    });

    if (!status) throw new NotFoundException('Status not found');

    return { service, client, status };
  }

  async findAll(params: IFilterParams = {} as IFilterParams) {
    const {
      clientId = null,
      clientName = null,
      serviceId = null,
      serviceName = null,
      statusId = null,
      statusName = null,
    } = params;

    try {
      return await this.bookingRepository.find({
        relations: {
          clientId: true,
          serviceId: true,
          statusId: true,
        },
        where: {
          clientId: {
            id: clientId,
            username: clientName,
          },
          serviceId: {
            id: serviceId,
            name: serviceName,
          },
          statusId: {
            id: statusId,
            name: statusName,
          },
        },
      });
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying find bookings');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} booking `;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking ${updateBookingDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking `;
  }
}
