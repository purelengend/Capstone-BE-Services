export interface ICreateProductDto {
    id?: string;
    name: string;
    description: string;
    basePrice: number;
    sellingPrice: number;
    coverPhoto: string;
    photoUrls: string[];
    categories?: string[];
    photosUrls?: string[];
    productVariants: {
        color: string;
        size: string;
        quantity: number;
        basePrice: number;
        sellingPrice: number;
    }[];
}