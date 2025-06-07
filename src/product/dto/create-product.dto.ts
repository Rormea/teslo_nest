import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsArray, IsIn } from "class-validator";



export class CreateProductDto {

    
    @ApiProperty({
        description: 'Unique identifier for the product',
        type: String,
        format: 'uuid',
        required: false,
    })
    @IsString()
    @MinLength(1)
    title:string;

    @ApiProperty({
        description: 'Price of the product',
        type: Number,
        required: false,
        minimum: 0,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;


    @ApiProperty({
        description: 'Description of the product',
        type: String,
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?:string;


    @ApiProperty({
        description: 'Unique slug for the product, used in URLs',
        type: String,
        required: false,
        nullable: true,
        uniqueItems: true,
    })
    @IsString()
    @IsOptional()
    slug?:string;


    @ApiProperty({
        description: 'Stock quantity of the product',
        type: Number,
        required: false,
        minimum: 0,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;


    @ApiProperty({
        description: 'Sizes available for the product',
        type: [String],
        required: true,
        example: ['S', 'M', 'L', 'XL'],
    })
    @IsString({ each: true })
    @IsArray()
    sizes:string[];


    @ApiProperty({
        description: 'Tags associated with the product',
        type: [String],
        required: false,
        example: ['shoes', 'nike', 'air-max'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags:string[];


    @ApiProperty({
        description: 'Images associated with the product',
        type: [String],
        required: false,
        example: ['image1.jpg', 'image2.jpg'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?:string[];
    
    
    @ApiProperty({
        description : 'Enums with clothing categories',
        type: String,
        required: true,
    })
    @IsIn(['men','women','kid','unisex'])
    gender: string;

}
