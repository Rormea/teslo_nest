import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interfaces';
import { GetUserDeco } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities/product.entity';



@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  
  @Post()
  @Auth() // Protege esta ruta para que solo los administradores y superusuarios puedan crear productos
  @ApiResponse({status: 201, description: 'Product created successfully', type: Product})
  @ApiResponse({status: 403, description: 'Forbidden token  or user does not have permission'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({status: 400, description: 'Bad Request'})
  create(@Body() createProductDto: CreateProductDto, 
  @GetUserDeco() user: User)
  {
    return this.productService.create(createProductDto, user);
  };

  
  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    //console.log(paginationDto) 
    //clg para serciorarnos que llegan como numero
    return this.productService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe ) id: string, 
  @Body() updateProductDto: UpdateProductDto,
  @GetUserDeco() user: User) {
    // Aquí puedes usar el usuario si necesitas registrar quién actualizó el producto
    // Por ejemplo, podrías agregar el usuario al DTO de actualización si es necesario
    // updateProductDto.user = user; // Si necesitas asociar el usuario que actualiza el producto
    return this.productService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}
