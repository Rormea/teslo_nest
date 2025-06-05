import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';


@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true, nullable: false })
    email: string;

    @Column({nullable: false, select: false})
    password: string;

    @Column({ type: 'text', nullable: false })
    fullname: string;

    @Column({ default: true })
    isActive: boolean;

    @Column("text", { array: true, default: ['user'] })  
    roles: string[];
    // Aquí puedes agregar más propiedades según tus necesidades

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    product : Product;



    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
        this.fullname = this.fullname.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.email = this.email.toLowerCase().trim();
        this.fullname = this.fullname.toLowerCase().trim();
    }
}

