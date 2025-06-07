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
    const firstUser = await this.insertSeedUsers();
    await this.insertSeedProducts(firstUser);
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

  private async insertSeedUsers() {
    const seedUsers = initialData.users;
    // To insert products we use the multiple promises technique But here we will use another form of "multiline" insertion
    const usersToInsert: User[] = []
    seedUsers.forEach(user => {
      const newUser = this.userRepository.create(user);
      usersToInsert.push(newUser);
    });
    const usersInDb = await this.userRepository.save(seedUsers);
    //console.log(usersToInsert);
    //console.log(seedUsers);
    //console.log(usersInDb)
    return usersInDb[0]
  }

  private async insertSeedProducts(user: User) {
    // Aquí puedes usar el primer usuario para asociarlo con los productos
    await this.productService.deleteAllProducts();

    const seedProducts = initialData.products;
    const insertPromises = [];
    seedProducts.forEach(product => {
      //(this.productService.create(product)); son varias promesas
      // para insertar en mi arreglo insertPromisse usamo .push
      insertPromises.push(this.productService.create(product, user));
    });
      await Promise.all(insertPromises);  
    return true;  
  }

}
