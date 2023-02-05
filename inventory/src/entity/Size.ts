import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Size  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        {
            unique: true,
        }
    )
    name: string;

    @OneToMany(() => ProductVariant, (productVariant) => productVariant.size)
    productVariants: ProductVariant[];

    @BeforeInsert()
    toUpperCaseWhenInsert() {
        this.name = this.name.toUpperCase();
    }

    @BeforeUpdate()
    toUpperCaseWhenUpdate() {
        this.name = this.name.toUpperCase();
    }
}