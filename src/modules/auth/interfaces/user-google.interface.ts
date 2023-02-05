import { Role } from 'src/modules/role/entities/role.entity';

export interface IGoogleFormat {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  isGoogleAccount: boolean;
  role: Role;
}
