
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name: 'products'})
export class Product {
    
    @ApiProperty({
        example: 'f1c2d3e4-5678-90ab-cdef-1234567890ab',
        description: 'Unique identifier for the product',
        format: 'uuid',
        type: 'string',
        required: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Nike Air Max',
        description: 'Title of the product',
        type: 'string',
        required: true,
        uniqueItems: true,

    })
    @Column({ type: 'text', unique: true })
    title:string;

    @ApiProperty({
        example: 99.99,
        description: 'Price of the product',
        type: 'number',
        required: true,
        format: 'float',
        minimum: 0,
    })
    @Column({ type: 'float', default: 0 })
    price:number;

    @ApiProperty({
        example: 'A comfortable and stylish pair of Nike Air Max shoes.',
        description: 'Description of the product',
        type: 'string',
        required: false,
        nullable: true,
    })
    @Column({ type: 'text', nullable: true })
    description:string;

    @ApiProperty({
        example: 'nike-air-max',
        description: 'Unique slug for the product, used in URLs',
        type: 'string',
        required: false,
        nullable: true,
        uniqueItems: true,
    })
    @Column({ type: 'text', nullable: true, unique: true })
    slug:string;

    @ApiProperty({
        example: 10,
        description: 'Stock quantity of the product',
        type: 'integer',
        required: true,
        minimum: 0,
    })
    @Column({ type: 'int', default: 0 })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'Available sizes for the product',
        type: 'array',
        items: { type: 'string' },
        required: false,
        nullable: true,
        default: [],
    })
    @Column({ type: 'text', array: true, default: [] })
    sizes:string[];

    @ApiProperty({
        example: 'M',
        description: 'clothing sizes (S, M, L, XL, XXL)',
        type: 'string',
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        enumName: 'SizeEnum',
    })
    @Column({ type: 'text'})
    gender: string;

    @ApiProperty({
        example: ['sports', 'shoes', 'nike'],
        description: 'Tags associated with the product',
        type: 'array',
        items: { type: 'string' },
        required: false,
        nullable: true,
        default: [],
    })
    @Column({ type: 'text', array: true, default: [] })
    tags: string[];

    @ApiProperty({
        example: [
            {
                url: 'https://example.com/image1.jpg',
                id: 'img-uuid-1'
            }
        ],
        type: [ProductImage],
        description: 'List of images associated with the product',
        isArray: true,
        required: false,
        nullable: true,
        default: [],
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product, { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product, {eager:true, onDelete: 'SET NULL' }
    )
    user : User

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll("'", '')
    };

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll("'", '')
    };



    
}
