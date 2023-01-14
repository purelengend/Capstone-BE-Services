export type RPCRequestProductVariantUpdateType = {
    productId: string;
    color: string;
    size: string;
    quantity: number;
};

export type RPCReplyProductVariantUpdateType = RPCRequestProductVariantUpdateType & {
    sellingPrice: number;
}
