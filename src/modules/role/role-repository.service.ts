import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class RoleRepositoryService {
  #logger = new Logger(RoleRepositoryService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getDefaultRole(defaultRole = 'AUTHENTICATED') {
    try {
      return await this.roleRepository
        .createQueryBuilder('roles')
        .where('roles.name = :value', { value: defaultRole })
        .getOne();
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error finding default role ');
    }
  }
}
