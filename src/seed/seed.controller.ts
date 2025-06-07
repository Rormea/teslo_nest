import { Controller, Get} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

import { ValidRoles } from 'src/auth/interfaces/valid-roles.interfaces';
import { Auth } from 'src/auth/decorators/auth.decorator';


@ApiTags('Seed') // Etiqueta para la documentación de Swagger
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  //@Auth( ValidRoles.admin) // Protege esta ruta con el decorador de roles
  excecuteSeed() {
    return this.seedService.runSeed();
  }

};
