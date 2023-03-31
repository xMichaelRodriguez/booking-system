import { Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';

import User from '../auth/entities/auth.entity';
import { Services } from '../booking-services/entities/services.entity';
import { Status } from '../status/entities/status.entity';
import { Booking } from './entities/booking.entity';
import {
  IBookingsNotifications,
  IPayloadNotification,
} from './interfaces/bookingNotifications.interface';

@Injectable()
export class NotificationService {
  #logger = new Logger(NotificationService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async searchOrdersByPreviousDate(): Promise<IBookingsNotifications[]> {
    const STATUS_ID = 1;
    try {
      return await this.bookingRepository
        .createQueryBuilder('booking')
        .select('booking.id', 'id')
        .addSelect('users.username', 'username')
        .addSelect('services.name', 'service')
        .addSelect('status.name', 'state')
        .addSelect('booking.note', 'note')
        .addSelect('booking.date', 'date')
        .leftJoin(User, 'users', 'users.id = booking.client_id')
        .leftJoin(Services, 'services', 'services.id = booking.service_id')
        .leftJoin(Status, 'status', 'status.id = booking.status_id')
        .where(
          `DATE("booking"."date") = DATE_TRUNC('day', NOW()) + INTERVAL '2 days'`,
        )
        .andWhere('booking.status_id = :statusId', { statusId: STATUS_ID })
        .getRawMany();
    } catch (error) {
      this.#logger.debug(error.message);
      throw new InternalServerErrorException('Something Wen Wrong :(');
    }
  }

  // @Cron('*/10 * * * * *', {
  //   timeZone: 'America/El_Salvador',
  // })
  @Cron('0 0 9 * * *', {
    timeZone: 'America/El_Salvador',
  })
  async sendNotifications() {
    try {
      const notifications: IBookingsNotifications[] =
        await this.searchOrdersByPreviousDate();

      const user: User = await this.userRepository.findOneBy({ id: 4 });
      notifications.forEach(async notification => {
        const { date, service, username } = notification;
        const formatDate = new Date(date)
          .toISOString()
          .split('T')
          .join(' ')
          .slice(0, 16);
        const payload: IPayloadNotification = {
          body: `Tienes ordenes por entregar para el dia: ${formatDate} \n Orden: ${service} \n para: ${username}`,
          token: user.deviceToken,
        };
        if (user.deviceToken) await this.senderMessage(payload);

        return;
      });
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException(
        'Error trying to send Notification',
      );
    }
  }

  senderMessage = async (payload: IPayloadNotification) => {
    const { body, token } = payload;
    const message = {
      notification: {
        title: 'Candy Cake Ordenes',
      },
      android: {
        notification: {
          body,
          icon: '@drawable/mipmap-xxxhdpi/android.png',
        },
      },
      token,
    };
    await admin.messaging().send(message);
  };
}
