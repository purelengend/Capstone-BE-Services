import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OneToMany } from "typeorm/decorator/relations/OneToMany";
import { User } from "./User";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        {
            type: 'varchar',
            length: 50,
            unique: true,
            nullable: false,
        }
    )
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}