import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Color } from './Color';
import { Size } from './Size';

@Entity()
export class ProductVariant extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column()
    productId: number;

    @ManyToOne(() => Color, (color) => color.productVariant)
    color: Color;

    @ManyToOne(() => Size, (size) => size.productVariant)
    size: Size;

    @Column()
    quantity: number;

    @Column()
    basePrice: number;

    @Column()
    sellingPrice: number;
}
