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
import { RoleService } from '../role/role.service';
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

    private readonly roleService: RoleService,
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
    stateId?: number,
  ): Promise<{ service: Services; client: User; status: Status }> {
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
    });

    if (!service) throw new NotFoundException('Service not found');

    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });

    if (!client) throw new NotFoundException('Client not found');

    let status = null;
    if (stateId)
      status = await this.statusRepository.findOne({
        where: { id: stateId },
      });
    else
      status = await this.statusRepository.findOne({
        where: { name: 'Reservado' },
      });

    if (!status) throw new NotFoundException('Status not found');

    return { service, client, status };
  }

  async findAll(user: User) {
    try {
      // get admin role
      const role = await this.roleService.getOne(1);
      if (user.role.id === role.id)
        return await this.bookingRepository.find({
          relations: {
            clientId: { role: true },
            serviceId: true,
            statusId: true,
          },
        });

      return await this.bookingRepository.find({
        relations: {
          clientId: true,
          serviceId: true,
          statusId: true,
        },
        where: {
          clientId: {
            id: user.id,
          },
        },
      });
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying find bookings');
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

  async updateStateBooking(id: number, stateId: number) {
    try {
      await this.bookingRepository
        .createQueryBuilder()
        .update(Booking)
        .set({
          statusId: {
            id: stateId,
          },
        })
        .where('id =:id', { id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  processedDateAndHour(bookingDto: CreateBookingDto | UpdateBookingDto) {
    const { date } = bookingDto;
    const dateObject = new Date(date);
    const processedTime = new Intl.DateTimeFormat('en-us', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObject);

    const processedDate = new Intl.DateTimeFormat('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObject);

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
