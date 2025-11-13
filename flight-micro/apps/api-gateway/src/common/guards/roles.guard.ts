import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const { userCurrent } = context.switchToHttp().getRequest();
    if (!userCurrent || !requiredRoles.includes(userCurrent.role)) {
      throw new ForbiddenException('Forbidden');
    }
    return true;
  }
}
