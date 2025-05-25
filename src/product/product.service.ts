import { BadRequestException, Injectable, InternalServerErrorException, Logger, ParseUUIDPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}


  async create(createProductDto: CreateProductDto) {
   
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
      // If the error is not handled, it will throw an InternalServerErrorException
      // or BadRequestException based on the error type.
    }
  }

  async findAll(paginationDto:PaginationDto) {

    const {limit=10, offset=0} = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(term: string) {
    return `This action returns a #${term} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

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
  }
}
