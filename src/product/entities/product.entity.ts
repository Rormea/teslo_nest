
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text'})
    title:string;

    @Column({ type: 'numeric', default: 0 })
    price:number;

    @Column({ type: 'text', nullable: true })
    description:string;

    @Column({ type: 'text', nullable: true, unique: true })
    slug:string;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'text', array: true, default: [] })
    sizes:string[];

    @Column({ type: 'text'})
    gender: string;

    
}
