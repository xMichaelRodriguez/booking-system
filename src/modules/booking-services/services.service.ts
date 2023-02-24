import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigurationService } from 'src/config/configuration';
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
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService,
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
      const baseUrl = this.configService.getbaseUrl();
      const token = this.configService.getAccessToken();

      const url = `${baseUrl}/me/media?fields=id,caption,media_url,thumbnail_url&access_token=${token}`;
      const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError) => {
            this.#logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error trying search services');
    }
  }

  async findOne(id: number) {
    try {
      const baseUrl = this.configService.getbaseUrl();
      const token = this.configService.getAccessToken();

      const url = `${baseUrl}/${id}?fields=id,caption,media_url,thumbnail_url&access_token=${token}`;
      const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError) => {
            this.#logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );
      return data;
    } catch (error) {}
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
