export class ItemDTO {
    productId: string;
    productVariantId?: string;
    productName: string;
    productPhotoUrl: string;
    color: string;
    size: string;
    sellingPrice?: number;
    quantity: number;
}