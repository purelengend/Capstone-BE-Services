export interface IProductDto {
    id?: string;
    name: string;
    description: string;
    basePrice: number;
    quantity: number;  
    coverPhotoUrl: string;
    categoryIds?: string[];
    photosUrls?: string[];
}