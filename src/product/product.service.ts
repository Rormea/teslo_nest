import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { validate as IsUUID } from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage } from './entities/product-image.entity';
import { privateDecrypt } from 'crypto';


@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}


  async create(createProductDto: CreateProductDto) {
    try {
      const {images = [], ...restProperties} = createProductDto;

      const product = this.productRepository.create({
        ...restProperties,
        images: images.map(image => this.productImageRepository.create({ url: image })),
      });
      await this.productRepository.save(product);
      return {...product,images};
    } catch (error) {
      this.handleDBExceptions(error);
      // If the error is not handled, it will throw an InternalServerErrorException
      // or BadRequestException based on the error type.
    }
  };

  async findAll(paginationDto:PaginationDto) {
    const {limit=10, offset=0} = paginationDto;
    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {images: true},
    })

    return product.map( product => ({
      ...product,
      images: product.images.map(image => image.url) // Map images to just URLs
    }))
  };

  async findOne(term: string) {
    let product: Product;
    if( IsUUID(term)){
      product = await this.productRepository.findOneBy({ id: term });
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('LOWER(title) =:title OR slug =:slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    };
    if (!product) {
      throw new BadRequestException(`Product with term "${term}" not found`);
    }
    return product;
  };

  //metodo para planar la imagenes 
  async findOnePlain(term: string) {
    const {images = [], ...restProduct} = await this.findOne(term);
    return {
      ...restProduct,
      images: images.map(image => image.url) // Map images to just URLs
    };
  };


  async update(id: string, updateProductDto: UpdateProductDto) {

    const {images, ...restProductUpdate} = updateProductDto;

    const product = await this.productRepository.preload({id, ...restProductUpdate});


    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    // Create query runner to handle images
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        // Delete old images
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        // Add new images
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      };
      await queryRunner.manager.save(product);
      //await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // Return the updated product with plain images
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.log(error)
      this.handleDBExceptions(error);
    }
  };

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException(`Product with ID ${id} not found`);
    }
    try {
      await this.productRepository.remove(product);
      return { message: 'Product removed successfully' };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail || 'Product already exists');
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Can't create product - ${error.message || 'check server logs'}`); 
  };
  

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
      .delete()
      .where({})
      .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    } 
  };
    

};
