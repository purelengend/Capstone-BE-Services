import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './ProductVariant';

@Entity()
export class Color {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        {
            unique: true,
        }
    )
    name: string;

    @OneToMany(() => ProductVariant, (productVariant) => productVariant.color)
    productVariants: ProductVariant[];

    @BeforeInsert()
    toLowerCaseWhenInsert() {
        this.name = this.name.toLowerCase();
    }

    @BeforeUpdate()
    toLowerCaseWhenUpdate() {
        this.name = this.name.toLowerCase();
    }
}