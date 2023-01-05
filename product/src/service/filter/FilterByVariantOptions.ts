import { ProductRetrieveResponseType } from './../../types/product';
import { INVENTORY_RPC } from './../../config';
import { requestRPC } from './../../message-queue/rpc/requestRPC';
import { IProductModel } from './../../model/productModel';
import { Filter } from './Filter';
import { RPCTypes } from './../../types/rpcType';

export type VariantOptionsType = {
    color?: [string];
    size?: [string];
};

export class FilterByVariantOptions extends Filter {
    private variantOptions: VariantOptionsType;

    constructor(variantOptions: VariantOptionsType) {
        super();
        this.variantOptions = variantOptions;
    }

    async extendFilterOptions(data: IProductModel[]): Promise<IProductModel[]> {
        const { color, size } = this.variantOptions;
        if (!color && !size) {
            return data;
        }
        const productId = data.map((product) => product.id);
        const requestPayload = {
            productId,
            color: color || [],
            size: size || [],
        };
        const productIdListRPCReply = (await requestRPC(
            INVENTORY_RPC,
            requestPayload
        )) as string[];
        const filteredProductList = data.filter((product) => {
            const matchedId = productIdListRPCReply.find(
                (productId) => productId === product.id
            );
            if (matchedId) {
                return true;
            }
            return false;
        });
        return filteredProductList;
    }

    async filterRPC(
        productModelList: IProductModel[],
        page = 1,
        pageSize = 10
    ): Promise<ProductRetrieveResponseType> {
        const { color, size } = this.variantOptions;
        if (!color && !size) {
            return {
                productList: productModelList,
                page,
                total: productModelList.length,
            };
        }
        const productId = productModelList.map((product) => product.id);
        const requestPayload = {
            type: RPCTypes.RESERVE_PRODUCT_VARIANT_QUANTITY,
            data: {
                productId,
                color: color || [],
                size: size || [],
                page,
                pageSize,
            },
        };
        const filterRPCReply = (await requestRPC(
            INVENTORY_RPC,
            requestPayload
        )) as { productIdList: string[]; page: number; total: number };
        const productIdRPCReplyList = filterRPCReply.productIdList;
        const filteredProductList = productModelList.filter((product) => {
            const matchedId = productIdRPCReplyList.find(
                (productId) => productId === product.id
            );
            if (matchedId) {
                return true;
            }
            return false;
        });
        return {
            productList: filteredProductList,
            page: filterRPCReply.page,
            total: filterRPCReply.total,
        };
    }
}
