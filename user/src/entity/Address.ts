import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity(
    {
        name: 'address',
    }
)
export class Address {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column(
        {
            type: 'varchar',
            length: 100,
            nullable: false,
        }
    )
    streetAddress: string;

    @Column(
        {
            type: 'varchar',
            length: 50,
            nullable: true,
        }
    )
    district: string;

    @Column(
        {
            type: 'varchar',
            length: 50,
            nullable: false,
        }
    )
    city: string;

    @Column(
        {
            type: 'varchar',
            length: 50,
            nullable: true,
        }
    )
    state: string;

    @Column(
        {
            type: 'varchar',
            length: 50,
            nullable: false,
        }
    )
    country: string;

    @Column(
        {
            type: 'varchar',
            length: 50,
            nullable: true,
        }
    )
    zipCode: string;
}