



import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from '../interfaces/valid-roles.interfaces';
import { UseRoleGuard } from '../guards/use-role/use-role.guard';



export function Auth(...roles: ValidRoles[]) {
    // Este decorador combina RoleProtected y UseGuards para proteger las rutas con roles específicos
  return applyDecorators(
    RoleProtected( ...roles ), // Aplica el decorador de roles
    // SetMetadata('roles', roles), // Alternativa para agregar metadatos personalizados, pero no es necesario si se usa RoleProtected
    // UseGuards(AuthGuard(), UseRoleGuard), // Protege la ruta con los guards de autenticación y roles
    // UseGuards es un decorador que aplica los guards especificados a la ruta
    // AuthGuard() es el guard de autenticación de JWT
    // UseRoleGuard es el guard que verifica los roles del usuario
    UseGuards( AuthGuard(), UseRoleGuard ),
  );
};
