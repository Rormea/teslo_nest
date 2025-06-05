import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UseRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    const user = request.user as User; // Obtiene el usuario del request, que fue inyectado por el guard de JWT
    const requiredRoles : string[] = this.reflector.get(ROLES_KEY, context.getHandler()) || []; // Obtiene los roles requeridos del handler
    //console.log(requiredRoles)
    if (!user) {
      throw new BadRequestException('User not found in request');
    }
    if (!requiredRoles.length) {
      return true; // Si no hay roles requeridos, permite el acceso
    }
    // Verifica si el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles.some(role => user.roles?.includes(role));
    // some devuelve true si al menos un elemento del array cumple con la condición
    // En este caso, verifica si el usuario tiene al menos uno de los roles requeridos
    if (!hasRole) {
      throw new ForbiddenException(`User ${user.email} does not have the required roles: ${requiredRoles.join(', ')}`);
    }
    // Si el usuario tiene al menos uno de los roles requeridos, permite el acceso
    // Puedes agregar más lógica aquí si es necesario, como registrar el acceso o lanzar excepciones personalizadas
    console.log(`User ${user.email} has access with roles: ${user.roles}`);
    // Si todo está bien, retorna true para permitir el acceso
    // Puedes agregar más lógica aquí si es necesario, como registrar el acceso o lanzar excepciones personalizadas
    return true;
  }
}
