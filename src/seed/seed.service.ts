import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';



@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductService,
  ) {}



  async runSeed() {
    await this.insertSeedProducts();
    return 'Seed executed successfully';
  }

  private async insertSeedProducts(){
    await this.productService.deleteAllProducts();

    const seedProducts = initialData.products;
    const insertPromises = [];
    seedProducts.forEach(product => {
      //(this.productService.create(product)); son varias promesas
      // para insertar en mi arreglo insertPromisse usamo .push
      insertPromises.push(this.productService.create(product));
    });
      await Promise.all(insertPromises);  
    return true;
  }

}
