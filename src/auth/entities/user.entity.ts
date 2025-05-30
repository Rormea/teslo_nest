import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';


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
    role: string[];
    // Aquí puedes agregar más propiedades según tus necesidades

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

