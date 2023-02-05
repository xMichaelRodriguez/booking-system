import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleAuthGuard } from 'src/guards/role-auth/role-auth.guard';

import { Role } from './entities/role.entity';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get()
  async find(): Promise<Role[]> {
    return this.roleService.getAll();
  }
  @UseGuards(new RoleAuthGuard('ADMIN', 'AUTHENTICATED'))
  @Get(':id')
  async findOne(@Query() id: string): Promise<Role[]> {
    return this.roleService.getOne(+id);
  }
}
