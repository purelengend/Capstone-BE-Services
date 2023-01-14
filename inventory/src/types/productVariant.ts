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
