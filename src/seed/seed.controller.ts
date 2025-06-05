import { Controller, Get} from '@nestjs/common';
import { SeedService } from './seed.service';

import { ValidRoles } from 'src/auth/interfaces/valid-roles.interfaces';
import { Auth } from 'src/auth/decorators/auth.decorator';



@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  //@Auth( ValidRoles.admin) // Protege esta ruta con el decorador de roles
  excecuteSeed() {
    return this.seedService.runSeed();
  }

};
