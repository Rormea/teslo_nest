import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductService,
    // Puedes inyectar otros servicios aquí si es necesario
    // Add other injected services here if needed
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async runSeed() {
    await this.deleteTables()
    await this.insertSeedProducts();
    return 'Seed executed successfully';
  }
 
  private async deleteTables() {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
    return true;
  }

  private async insertSeedProducts(){
    await this.productService.deleteAllProducts();

    const seedProducts = initialData.products;
    const insertPromises = [];
    /* seedProducts.forEach(product => {
      //(this.productService.create(product)); son varias promesas
      // para insertar en mi arreglo insertPromisse usamo .push
      insertPromises.push(this.productService.create(product));
    }); */
      await Promise.all(insertPromises);  
    return true;
  }

}
