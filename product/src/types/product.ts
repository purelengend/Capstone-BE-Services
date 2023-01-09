import { IProductModel } from './../model/productModel';

export type RetrieveProductRequest = {
    page?: number;
    pageSize?: number;
    orderBy?: SortFieldProduct;
    sortBy?: 'asc' | 'desc';
    filters?: FilterProductRequest;
};

export type FilterProductRequest = {
    category?: string[];
    priceRange?: string;
    color?: string[];
    size?: string[];
};

export type ProductRetrieveResponseType = {
    productList: IProductModel[];
    page: number;
    total: number;
};

export type ProductQueryFilterOptions = {
    categories?: { $in: string[] };
    basePrice?: { $gte: number; $lte: number };
};

export type VariantFilterOptions = {
    colorList?: string[];
    sizeList?: string[];
};

export type SortFieldProduct = 'basePrice' | 'rating';
