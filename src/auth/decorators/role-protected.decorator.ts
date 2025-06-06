import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interfaces';

export const ROLES_KEY = 'roles';


export const RoleProtected = (...args: ValidRoles[]) => {


    return SetMetadata( ROLES_KEY, args)
};
