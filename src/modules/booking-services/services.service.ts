import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigurationService } from 'src/config/configuration';
import { Repository } from 'typeorm';

import { PaginatedServicesDto } from './dto/pagination-service.dto';
import { Services } from './entities/services.entity';
import { OrderType } from './enums/sort-enum';
import {
  IService,
  IServiceIg,
  IServiceParsed,
} from './interface/service.interface';

@Injectable()
export class BookingServicesService {
  #logger = new Logger(BookingServicesService.name);
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService,
  ) {}

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

  @Cron(CronExpression.EVERY_WEEK)
  async getIgProductsCron() {
    try {
      const baseUrl = this.configService.getbaseUrl();
      const token = this.configService.getAccessToken();

      const allProducts = await this.fetchAllProducts(baseUrl, token);

      const newProducts = await this.filterNewProducts(allProducts);

      const parsedProducts: IServiceParsed[] =
        this.parsedNewProducts(newProducts);

      await this.insertNewProducts(parsedProducts);
    } catch (error) {
      this.#logger.error(error.message);
    }
  }

  async fetchAllProducts(baseUrl: string, token: string) {
    let url = `${baseUrl}/v16.0/me/media?fields=id,caption,media_url,thumbnail_url&access_token=${token}&limit=25`;
    let allProducts = [];
    let data: IServiceIg;
    do {
      data = await this.fetchDataFromApi(url);
      allProducts = [...allProducts, ...data.data];

      if (data.paging.next) {
        const nextUrl = new URL(data.paging.next);
        url = `${baseUrl}${
          nextUrl.pathname
        }?fields=id,caption,media_url,thumbnail_url&access_token=${token}&limit=25&after=${nextUrl.searchParams.get(
          'after',
        )}`;
      }
    } while (data.paging.next);
    return allProducts;
  }

  async filterNewProducts(products: IService[]) {
    const existingProducts = await this.servicesRepository.find();
    const existingIds = existingProducts.map(product => product.igPostId);

    const newProducts = products.filter(
      product => !existingIds.includes(product.id),
    );
    return newProducts;
  }

  parsedNewProducts(newProducts: IService[]) {
    // Rename property "id" to "igPostId"
    const newProductsRenamed = newProducts.map(product => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, media_url: mediaUrl, thumbnail_url, caption } = product;
      return {
        caption,
        mediaUrl,
        igPostId: +id,
      };
    });

    return newProductsRenamed;
  }

  async insertNewProducts(newProducts: IServiceParsed[]) {
    await this.servicesRepository
      .createQueryBuilder()
      .createQueryBuilder()
      .insert()
      .into(Services)
      .values(newProducts)
      .execute();

    this.#logger.debug('DATA SAVED');
  }

  async fetchDataFromApi(url: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<IServiceIg>(url).pipe(
        catchError((error: AxiosError) => {
          this.#logger.error(error.response.data);
          throw new Error('An error happened!');
        }),
      ),
    );

    return data;
  }
}
