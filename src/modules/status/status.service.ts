import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
  #logger = new Logger(StatusService.name);
  constructor(
    @InjectRepository(Status)
    private readonly stateRepository: Repository<Status>,
  ) {}

  async create(createStatusDto: CreateStatusDto) {
    const stateToSave = this.stateRepository.create(createStatusDto);

    try {
      return await this.stateRepository.save(stateToSave);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('This state is already registered');
      this.#logger.error(error.message);

      throw new InternalServerErrorException('Error trying create state');
    }
  }

  async findAll() {
    try {
      return await this.stateRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error trying find states');
    }
  }

  async findOne(id: number) {
    const state = await this.stateRepository.findOneBy({ id });

    if (!state) throw new NotFoundException('State not found');

    return state;
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    await this.findOne(id);

    try {
      return await this.stateRepository
        .createQueryBuilder()
        .update(Status)
        .set(updateStatusDto)
        .execute();
    } catch (error) {
      throw new InternalServerErrorException('Error trying update service');
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.stateRepository
        .createQueryBuilder('status')
        .delete()
        .from(Status)
        .where('id=:id', { id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException('Error trying delete state');
    }
  }
}
