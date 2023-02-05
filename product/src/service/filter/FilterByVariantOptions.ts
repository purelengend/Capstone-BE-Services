import { ProductRetrieveResponseType } from './../../types/product';
import { INVENTORY_RPC } from './../../config';
import { requestRPC } from './../../message-queue/rpc/requestRPC';
import { IProductModel } from './../../model/productModel';
import { Filter } from './Filter';
import { RPCTypes } from './../../types/rpcType';

export type VariantOptionsType = {
    colorList?: string[];
    sizeList?: string[];
};

export class FilterByVariantOptions extends Filter {
    private variantOptions: VariantOptionsType;

    constructor(variantOptions: VariantOptionsType) {
        super();
        this.variantOptions = variantOptions;
    }

    async extendFilterOptions(_: IProductModel[]) {}

    async retrieveVariantRPC(
        productModelList: IProductModel[],
        page = 1,
        pageSize = 10
    ): Promise<ProductRetrieveResponseType> {        
        const { colorList, sizeList } = this.variantOptions;
        if ((!colorList && !sizeList) || (colorList!.length === 0 && sizeList!.length === 0)) {
            return {
                productList: productModelList,
                page,
                total: productModelList.length,
            };
        }
        const productIdList = productModelList.map((product) => product.id);
        const requestPayload = {
            type: RPCTypes.FILTER_PRODUCT_BY_COLOR_AND_SIZE,
            data: {
                productIdList,
                colorList: colorList || [],
                sizeList: sizeList || [],
                page,
                pageSize,
            },
        };
        const filterRPCReply = (await requestRPC(
            INVENTORY_RPC,
            requestPayload
        )) as { productIdList: string[]; page: number; total: number };
        const productIdRPCReplyList = filterRPCReply.productIdList;
        console.log("🚀 ~ file: FilterByVariantOptions.ts:52 ~ FilterByVariantOptions ~ productIdRPCReplyList", productIdRPCReplyList)
        const filteredProductList = productModelList.filter((product) => {
            const matchedId = productIdRPCReplyList.find(
                (productId) => productId === product.id?.toString()
            );
            if (matchedId) {
                return true;
            }
            return false;
        });
        console.log("🚀 ~ file: FilterByVariantOptions.ts:62 ~ FilterByVariantOptions ~ filteredProductList ~ filteredProductList", filteredProductList)
        return {
            productList: filteredProductList,
            page: filterRPCReply.page,
            total: filterRPCReply.total,
        };
    }
}
