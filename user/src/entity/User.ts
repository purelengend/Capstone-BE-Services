import { Role } from './Role';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(
    {
        name: 'users',
    }
)
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column(
        {
            type: 'varchar',
            length: 50,
            unique: true,
            nullable: false,
        }
    )
    username: string;
    
    @Column(
        {
            type: 'varchar',
            length: 100,
            nullable: false,
        }
    )
    password: string;

    @Column(
        {
            type: 'varchar',
            unique: true,
        }
    )
    email: string;
    
    @Column()
    phoneNumber: string;

    @Column()
    gender: string;

    @Column()
    address: string;

    @Column()
    avatarUrl?: string;

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;
}