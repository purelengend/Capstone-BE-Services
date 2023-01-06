export type variantFilterRPCRequest = {
    productIdList: string[];
    color: string[];
    size: string[];
    page: number;
    pageSize: number;
}

export type variantFilterRPCResponse = {
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
