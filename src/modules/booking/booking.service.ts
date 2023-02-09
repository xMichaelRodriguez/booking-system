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
    const isValidBooking = await this.checkReservationValid(
      bookingToSave.hour,
      bookingToSave.date,
    );
    if (isValidBooking)
      throw new ConflictException(
        'A reservation already exists for the time you are trying to book',
      );

    try {
      return await this.bookingRepository.save(bookingToSave);
    } catch (error) {
      this.#logger.debug({ error });
      this.#logger.error(error.message);

      throw new InternalServerErrorException('Error trying create booking');
    }
  }

  async checkReservationValid(hour: string, date: string) {
    try {
      const bookings = await this.bookingRepository.findBy({ date });
      return bookings.some(booking => booking.hour === hour);
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying create booking');
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

  async findOne(id: number, params: IFilterParams = {} as IFilterParams) {
    const {
      clientId = null,
      clientName = null,
      serviceId = null,
      serviceName = null,
      statusId = null,
      statusName = null,
    } = params;

    try {
      return await this.bookingRepository.findOne({
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
      throw new InternalServerErrorException('Error trying find booking');
    }
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
    processedTime: string,
    processedDate: string,
  ) {
    const booking = {
      ...updateBookingDto,
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
    const isValidBooking = await this.checkReservationValid(
      bookingToSave.hour,
      bookingToSave.date,
    );
    if (isValidBooking)
      throw new ConflictException(
        'A reservation already exists for the time you are trying to book',
      );

    try {
      await this.bookingRepository
        .createQueryBuilder()
        .update(Booking)
        .set(bookingToSave)
        .where('id= :id', { id })
        .execute();
    } catch (error) {
      this.#logger.error(error.message);

      throw new InternalServerErrorException('Error trying create booking');
    }
  }

  processedDateAndHour(bookingDto: CreateBookingDto | UpdateBookingDto) {
    const { hour, date } = bookingDto;

    const newHour = new Date(hour);
    const newDate = new Date(date);
    const processedTime = new Intl.DateTimeFormat('en-us', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(newHour);

    const processedDate = new Intl.DateTimeFormat('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(newDate);

    return {
      processedDate,
      processedTime,
    };
  }
  async remove(id: number) {
    try {
      await this.bookingRepository
        .createQueryBuilder('Booking')
        .delete()
        .from(Booking)
        .where('id =:id', { id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException('Error trying Delete Booking');
    }
  }
}
