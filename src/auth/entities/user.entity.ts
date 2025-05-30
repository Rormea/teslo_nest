import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true, nullable: false })
    email: string;

    @Column({nullable: false, select: false})
    password: string;

    @Column({ type: 'text', unique: true, nullable: false })
    fullname: string;

    @Column({ default: true })
    isActive: boolean;

    @Column("text", { array: true, default: ['user'] })  
    role: string[];
    // Aquí puedes agregar más propiedades según tus necesidades
}
