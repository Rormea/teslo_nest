import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductModule, AuthModule] // Importa el módulo de autenticación si es necesario
})
export class SeedModule {}
