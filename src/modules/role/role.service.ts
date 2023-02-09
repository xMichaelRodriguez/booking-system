import {
  Injectable,
  NotFoundException,
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
    try {
      return await this.roleRepository.find();
    } catch (error) {
      this.#logger.error(error.message);
      throw new InternalServerErrorException('Error trying find roles');
    }
  }

  async getOne(id: number): Promise<Role> {
    const role = await this.roleRepository

      .createQueryBuilder('roles')
      .where('roles.id = :id', { id })
      .getOne();

    if (!role) throw new NotFoundException('Role Not Found');

    return role;
  }
}
