import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Color } from './Color';
import { Size } from './Size';

@Entity()
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column()
    productId: string;

    @ManyToOne(() => Color, (color) => color.productVariants)
    color: Color;

    @ManyToOne(() => Size, (size) => size.productVariants)
    size: Size;

    @Column()
    quantity: number;

    @Column()
    basePrice: number;

    @Column()
    sellingPrice: number;
}
