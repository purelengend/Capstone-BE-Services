import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class Size extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => ProductVariant, (productVariant) => productVariant.size)
    productVariant: ProductVariant[];
}