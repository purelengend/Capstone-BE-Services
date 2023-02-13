import ProductVariantDTO from "../dto/ProductVariantDTO";

export type VariantFilterRPCRequest = {
    productIdList: string[];
    colorList: string[];
    sizeList: string[];
    page: number;
    pageSize: number;
};

export type VariantFilterRPCResponse = {
    productIdList: string[];
    page: number;
    total: number;
};

export type VariantFilterOptions = {
    color: string[];
    size: string[];
    page: number;
    pageSize: number;
};

export type CreateVariantRPCRequest = {
    productVariantList: ProductVariantDTO[];
    colorNameList: string[];
    sizeNameList: string[];
};

export type UpdateVariantRPCRequest = CreateVariantRPCRequest & {
    productId: string;
};
