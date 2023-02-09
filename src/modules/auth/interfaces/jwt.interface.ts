import { Role } from 'src/modules/role/entities/role.entity';

export interface JwtPayload {
  id: number;
  email: string;
  isActive: boolean;
  role: Role;
}
