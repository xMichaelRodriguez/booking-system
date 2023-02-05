import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  #logger = new Logger(RoleService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async getAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async getOne(id: number): Promise<Role[]> {
    try {
      return await this.roleRepository
        .createQueryBuilder('roles')
        .where('roles.id = :value', { value: id })
        .getMany();
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error Finding roles');
    }
  }
}
