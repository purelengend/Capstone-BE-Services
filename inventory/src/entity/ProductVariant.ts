import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    // Not lower than 0
    @Column()
    @Check('"quantity" >= 0')
    quantity: number;

    @Column()
    @Check('"basePrice" >= 0')
    basePrice: number;

    @Column()
    @Check('"sellingPrice" >= 0')
    sellingPrice: number;
}
