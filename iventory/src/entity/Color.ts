import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './ProductVariant';

@Entity()
export class Color extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => ProductVariant, (productVariant) => productVariant.color)
    productVariant: ProductVariant[];
}