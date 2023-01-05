import { INVENTORY_RPC } from './../../config';
import { requestRPC } from './../../message-queue/rpc/requestRPC';
import { IProductModel } from './../../model/productModel';
import { Filter } from "./Filter";

export type VariantOptionsType = {
    color?: [string];
    size?: [string];
}

export class FilterByVariantOPtions extends Filter {
    private variantOptions: VariantOptionsType;

    constructor(variantOptions: VariantOptionsType) {
        super();
        this.variantOptions = variantOptions;
    }

    async filter(data: IProductModel[]): Promise<IProductModel[]> {
        const { color, size } = this.variantOptions;
        if (!color && !size) {
            return data;
        }
        const productId = data.map((product) => product.id);
        const requestPayload = {
            productId,
            color: color || [],
            size: size || [],
        }
        const productIdListRPCReply = await requestRPC(INVENTORY_RPC, requestPayload) as  string[];
        const filteredProductList = data.filter((product) => {
            const matchedId = productIdListRPCReply.find((productId) => productId === product.id);
            if (matchedId) {
                return true;
            }
            return false;
        })
        return filteredProductList;
    }

    async filterRPC(productModelList: IProductModel[], page = 1, limit = 10): Promise<{productModelList: IProductModel[],page: number, total: number}> {
        const { color, size } = this.variantOptions;
        if (!color && !size) {
            return {
                productModelList,
                page,
                total: productModelList.length
            };
        }
        const productId = productModelList.map((product) => product.id);
        const requestPayload = {
            productId,
            color: color || [],
            size: size || [],
            page,
            limit
        }
        const filterRPCReply = await requestRPC(INVENTORY_RPC, requestPayload) as  {productIdList: string[],page: number, total: number};
        const productIdRPCReplyList = filterRPCReply.productIdList;
        const filteredProductList = productModelList.filter((product) => {
            const matchedId = productIdRPCReplyList.find((productId) => productId === product.id);
            if (matchedId) {
                return true;
            }
            return false;
        })
        return {
            productModelList: filteredProductList,
            page: filterRPCReply.page,
            total: filterRPCReply.total
        };
    }
}