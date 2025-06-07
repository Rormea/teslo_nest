import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name: 'product_images'})
export class ProductImage {

    @ApiProperty({
        example: 'f1c2d3e4-5678-90ab-cdef-1234567890ab',
        description: 'Unique identifier for the product image',
        format: 'uuid',
        type: 'string',
        required: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'https://example.com/images/product-image.jpg',
        description: 'URL of the product image',
        type: 'string',
        required: true,
    })
    @Column({ type: 'text' })
    url: string;
    

    @ApiProperty({
        example: 'Product Image',
        description: 'Alternative text for the product image',
        type: 'string',
        required: false,
        nullable: true,
    })                                                   
    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE'}
    )
    product: Product

   
}