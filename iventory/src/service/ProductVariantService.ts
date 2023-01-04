import { ShoppingRPCReplyProductVariantType } from './../types/shoppingRpcType';
import {
    RPCReplyProductVariantUpdateType,
    RPCRequestProductVariantUpdateType,
} from './../types/orderRpcType';
import CreateProductVariantDTO from '../dto/CreateProductVariantDTO';
import { RPCTypes } from './../types/rpcType';
import { ProductVariantRepository } from './../repository/ProductVariantRepository';
import { IService } from './../service/IService';
import { ProductVariant } from './../entity/ProductVariant';
import { RPCPayload } from './../types/utilTypes';
import { ColorService } from './ColorService';
import { SizeService } from './SizeService';
import UpdateProductVariantDTO from 'src/dto/UpdateProductVariantDTO';

export class ProductVariantService implements IService {
    private productVariantRepository: ProductVariantRepository;
    private colorService: ColorService;
    private sizeService: SizeService;

    constructor() {
        this.productVariantRepository = new ProductVariantRepository();
        this.colorService = new ColorService();
        this.sizeService = new SizeService();
    }

    async getAll(): Promise<ProductVariant[]> {
        return this.productVariantRepository.getAll();
    }

    async findById(id: string): Promise<ProductVariant> {
        return this.productVariantRepository.findById(id);
    }

    async createProductVariant(
        productVariantDTO: CreateProductVariantDTO
    ): Promise<ProductVariant> {
        const { colorId, sizeId } = productVariantDTO;
        const [color, size] = await Promise.all([
            this.colorService.findById(colorId),
            this.sizeService.findById(sizeId),
        ]);
        const productVariant = Object.assign(
            new ProductVariant(),
            productVariantDTO,
            { color, size }
        );
        return this.productVariantRepository.createProductVariant(
            productVariant
        );
    }

    async updateProductVariant(
        id: string,
        productVariantDTO: UpdateProductVariantDTO
    ): Promise<ProductVariant> {
        const { colorId, sizeId } = productVariantDTO;
        const [color, size] = await Promise.all([
            this.colorService.findById(colorId),
            this.sizeService.findById(sizeId),
        ]);

        const productVariant = await this.findById(id);
        Object.assign(productVariant, productVariantDTO, { color, size });
        return this.productVariantRepository.updateProductVariant(
            id,
            productVariant
        );
    }

    async deleteProductVariant(id: string): Promise<ProductVariant> {
        return this.productVariantRepository.deleteProductVariant(id);
    }

    async reserveProductVariantsQuantity(
        requestProductList: RPCRequestProductVariantUpdateType[]
    ) {
        const productVariantList =
            await this.productVariantRepository.findByProductIdAndColorAndSizeList(
                requestProductList
            );

        console.log(
            '🚀 ~ file: ProductVariantService.ts:78 ~ ProductVariantService ~ productVariantList',
            productVariantList
        );

        const productVariantMap =
            this.createProductVariantMapByList(productVariantList);

        const isEnoughStock = this.validateReserveProductVariantQuantity(
            requestProductList,
            productVariantMap
        );

        if (!isEnoughStock) {
            return {
                status: 'FAILED',
                message: 'Product variant quantity not enough',
            };
        }

        const updatedProductVariantList =
            await this.updateProductVariantQuantityByRPCReverse(
                requestProductList,
                productVariantMap
            );

        // Map the product variant list to RPCReplyProductVariantUpdateType
        const responseReverseProductList =
            updatedProductVariantList.map<RPCReplyProductVariantUpdateType>(
                (productVariant) => {
                    const { productId, color, size, sellingPrice, quantity } =
                        productVariant;
                    return {
                        productId,
                        color: color.name,
                        size: size.name,
                        quantity,
                        sellingPrice,
                    };
                }
            );

        return {
            status: 'SUCCESS',
            message: 'Product variants in order was reserved',
            productVariantList: responseReverseProductList,
        };
    }

    createProductVariantMapByList(productVariantList: ProductVariant[]) {
        return productVariantList.reduce(
            (acc: Map<string, ProductVariant>, productVariant) => {
                const { productId, color, size } = productVariant;
                let key = `${productId}-${color.name}-${size.name}`;
                acc.set(key, productVariant);
                return acc;
            },
            new Map()
        );
    }

    async updateProductVariantQuantityByRPCReverse(
        revereProductList: RPCRequestProductVariantUpdateType[],
        productVariantMap: Map<string, ProductVariant>
    ) {
        revereProductList.forEach((revereProductList) => {
            const {
                productId,
                color,
                size,
                quantity: reverseQuantity,
            } = revereProductList;
            let key = `${productId}-${color}-${size}`;
            const productVariant = productVariantMap.get(key);
            productVariant!.quantity -= reverseQuantity;
        });
        return this.productVariantRepository.updateManyProductVariantQuantity(
            Array.from(productVariantMap.values())
        );
    }

    validateReserveProductVariantQuantity(
        revereProductList: RPCRequestProductVariantUpdateType[],
        productVariantMap: Map<string, ProductVariant>
    ): boolean {
        for (const reverseProduct of revereProductList) {
            const {
                productId,
                color,
                size,
                quantity: reverseQuantity,
            } = reverseProduct;
            let key = `${productId}-${color}-${size}`;
            const stockQuantity = productVariantMap.get(key)?.quantity ?? 0;
            if (stockQuantity < reverseQuantity) {
                return false;
            }
        }
        return true;
    }

    async releaseProductVariantQuantity(data: any): Promise<ProductVariant> {
        const { productVariantId, quantity } = data;
        const productVariant = await this.productVariantRepository.findById(
            productVariantId
        );
        productVariant.quantity += quantity;
        return this.productVariantRepository.save(productVariant);
    }

    async getProductVariantByProductIdColorSize(
        productId: string,
        color: string,
        size: string
    ): Promise<ShoppingRPCReplyProductVariantType | null> {
        const productVariant =
            await this.productVariantRepository.findByProductIdColorAndSize(
                productId,
                color,
                size
            );
        const replyProductVariant = productVariant
            ? {
                  ...productVariant,
                  color: productVariant.color.name,
                  size: productVariant.size.name,
              }
            : null;
        return replyProductVariant;
    }

    async findByIdList(idList: string[]) {
        const productVariantList = idList.map((id) =>
            this.productVariantRepository.findById(id)
        );
        return Promise.all(productVariantList);
    }

    async serveRPCGetProductVariantListByIdList(
        idList: string[]
    ): Promise<ShoppingRPCReplyProductVariantType[]> {
        const productVariantList = await this.findByIdList(idList);
        const replyProductVariantList = productVariantList.map(
            (productVariant) => {
                return {
                    ...productVariant,
                    color: productVariant.color.name,
                    size: productVariant.size.name,
                };
            }
        );
        return replyProductVariantList;
    }

    subscribeEvents(_: string): void {
        throw new Error('Method not implemented.');
    }
    serveRPCRequest(payload: RPCPayload) {
        const { type, data } = payload;
        console.log('RPC request received', {
            type,
            data,
        });

        switch (type) {
            case RPCTypes.RESERVE_PRODUCT_VARIANT_QUANTITY:
                const { productVariantList } = data;
                return this.reserveProductVariantsQuantity(productVariantList);
            case RPCTypes.GET_PRODUCT_VARIANT_BY_PRODUCT_ID_COLOR_SIZE:
                const { productId, color, size } = data;
                return this.getProductVariantByProductIdColorSize(
                    productId,
                    color,
                    size
                );
            case RPCTypes.GET_PRODUCT_VARIANT_LIST_BY_ID_LIST:
                const { productVariantIdList } = data;
                return this.serveRPCGetProductVariantListByIdList(
                    productVariantIdList
                );
            default:
                throw new Error('Invalid RPC type');
        }
    }
}
