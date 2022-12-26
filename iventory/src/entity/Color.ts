import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './ProductVariant';

@Entity()
export class Color {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => ProductVariant, (productVariant) => productVariant.color)
    productVariants: ProductVariant[];
}