import { Role } from './Role';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from './Address';

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
    avatarUrl?: string;

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    @OneToOne(() => Address)
    @JoinColumn()
    address: Address;
}