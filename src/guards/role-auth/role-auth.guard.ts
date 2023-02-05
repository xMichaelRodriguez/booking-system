import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  #roles: string[];

  constructor(...roles: string[]) {
    this.#roles = roles;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();

    const { user } = ctx.getRequest();

    if (!this.#roles.includes(user.role.name))
      throw new ForbiddenException('Forbidden Role');

    return true;
  }
}
