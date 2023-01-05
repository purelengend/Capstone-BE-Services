import { IProductModel } from './../model/productModel';

export type ProductRetrieveResponseType = {
    productList: IProductModel[];
    page: number;
    total: number;
};

export type ProductQueryFilterOptions = {
    categories?: { $in: string[] };
    basePrice?: { $gte: number; $lte: number };
};
