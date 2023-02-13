import { ProductVariant } from '../entity/ProductVariant';
export default class ProductVariantDTO {
    id?: string;
    productId: string;
    color: string;
    size: string;
    quantity: number;
    basePrice: number;
    sellingPrice: number;

    constructor(
        productId: string,
        color: string,
        size: string,
        quantity: number,
        basePrice: number,
        sellingPrice: number,
        id?: string
    ) {
        id && (this.id = id);
        this.productId = productId;
        this.color = color;
        this.size = size;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.sellingPrice = sellingPrice;
    }

    static toDTO(productVariant: ProductVariant): ProductVariantDTO { 
        return new ProductVariantDTO(
            productVariant.productId,
            productVariant.color.name,
            productVariant.size.name,
            productVariant.quantity,
            productVariant.basePrice,
            productVariant.sellingPrice,
            productVariant.id
        );
    }

    static toDTOs(productVariants: ProductVariant[]): ProductVariantDTO[] {
        return productVariants.map(ProductVariantDTO.toDTO);
    }
}