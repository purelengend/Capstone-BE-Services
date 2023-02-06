import { CreateVariantRPCRequest } from './../types/productVariant';
import {
    VariantFilterRPCRequest,
    VariantFilterRPCResponse,
} from '../types/productVariant';
import { ShoppingRPCReplyProductVariantType } from '../types/shoppingRpcType';
import {
    RPCReplyProductVariantUpdateType,
    RPCRequestProductVariantUpdateType,
} from '../types/orderRpcType';
import CreateProductVariantDTO from '../dto/CreateProductVariantDTO';
import { RPCTypes } from '../types/rpcType';
import { ProductVariantRepository } from '../repository/ProductVariantRepository';
import { IService } from './IService';
import { ProductVariant } from '../entity/ProductVariant';
import { EventPayload, RPCPayload } from '../types/utilTypes';
import { ColorService } from './ColorService';
import { SizeService } from './SizeService';
import UpdateProductVariantDTO from '../dto/UpdateProductVariantDTO';
import EventType from './../types/eventType';

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
        const [color, size] = await Promise.all([
            this.colorService.findByName(productVariantDTO.color),
            this.sizeService.findByName(productVariantDTO.size),
        ]);
        if (!color || !size) {
            throw new Error('Color or size not found');
        }
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
        const [color, size] = await Promise.all([
            this.colorService.findByName(productVariantDTO.color),
            this.sizeService.findByName(productVariantDTO.size),
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

    async getStockQuantityByProductIdAndColorAndSize(
        productId: string,
        color: string,
        size: string
    ): Promise<{ stock: number }> {
        const stock = await this.productVariantRepository.getStockQuantityByProductIdAndColorAndSize(
            productId,
            color,
            size
        );
        return { stock }
    }

    async reserveProductVariantsQuantity(
        requestProductList: RPCRequestProductVariantUpdateType[]
    ) {
        console.log({ requestProductList });

        const productVariantList =
            await this.productVariantRepository.findByListProductIdAndColorAndSize(
                requestProductList
            );

        if (productVariantList.length !== requestProductList.length) {
            return {
                status: 'FAILED',
                message: 'Product variant not found',
            };
        }

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
                    const { productId, color, size, basePrice, sellingPrice, quantity } =
                        productVariant;
                    return {
                        productId,
                        color: color.name,
                        size: size.name,
                        quantity,
                        sellingPrice: sellingPrice || basePrice,
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

    async retrieveProductByVariantFilterOptions(
        filterOptions: VariantFilterRPCRequest
    ): Promise<VariantFilterRPCResponse> {
        const { colorList, sizeList } = filterOptions;
        let { productIdList, page, pageSize } = filterOptions;

        // findByProductIdListAndColorListAndSizeList will return a list of product id
        let productVariantFilteredList =
            await this.productVariantRepository.findInStockByProductIdListAndColorListAndSizeList(
                productIdList,
                colorList,
                sizeList
            );
        let productIdFilteredList = productVariantFilteredList.map(
            (productVariant) => productVariant.productId
        );
        const productIdSet = new Set(productIdFilteredList);

        const total = productIdSet.size;

        // using productIdList to guarantee the order of product id that could be sorted in product service
        productIdList = productIdList.filter((productId) => {
            return productIdSet.has(productId);
        });
        // Slice the product id list by page and pageSize
        if (page > Math.ceil(total / pageSize) || page < 1) {
            page = 1;
        }
        if (pageSize < 1) {
            pageSize = 10;
        }
        productIdList = productIdList.slice(
            (page - 1) * pageSize,
            page * pageSize
        );
        return {
            productIdList,
            page,
            total,
        };
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

    async launchDiscountOnProductVariant(
        productIdList: string[],
        discountValue: number
    ): Promise<void> {
        const productVariantList =
            await this.productVariantRepository.findByProductIdList(
                productIdList
            );

        if (productVariantList.length === 0) {
            throw new Error('Product variant not found');
        }
        if (discountValue >= 1) {
            this.updateSellingPriceOfProductVariantByDiscountValue(
                productVariantList,
                discountValue
            );
        } else if (discountValue > 0 && discountValue < 1) {
            this.updatePriceOfProductVariantByDiscountPercentage(
                productVariantList,
                discountValue
            );
        }
        await this.productVariantRepository.updateManyProductVariantSellingPrice(
            productVariantList
        );
    }

    async endDiscountOnProductVariant(productIdList: string[]): Promise<void> {
        const productVariantList =
            await this.productVariantRepository.findByProductIdList(
                productIdList
            );
        productVariantList.forEach(async (productVariant) => {
            productVariant.sellingPrice = productVariant.basePrice;
            await this.productVariantRepository.save(productVariant);
        });
    }

    updateSellingPriceOfProductVariantByDiscountValue(
        productVariantList: ProductVariant[],
        value: number
    ): void {
        productVariantList.forEach((productVariant) => {
            productVariant.sellingPrice -= value;
        });
    }

    updatePriceOfProductVariantByDiscountPercentage(
        productVariantList: ProductVariant[],
        percentage: number
    ): void {
        productVariantList.forEach((productVariant) => {
            productVariant.sellingPrice -=
                productVariant.basePrice * percentage;
        });
    }

    async serveCreateVariantRPCRequest(request: CreateVariantRPCRequest) {
        const { productVariantList, colorNameList, sizeNameList } = request
        const [sizes, colors] = await Promise.all([
            this.sizeService.findSizesByNameList(sizeNameList),
            this.colorService.findColorsByNameList(colorNameList)
        ])

        if (colorNameList.length !== colors.length || sizeNameList.length !== sizes.length) {
            const notExistedColor = colorNameList.filter(colorName => !colors.find(color => color.name === colorName))
            const notExistedSize = sizeNameList.filter(sizeName => !sizes.find(size => size.name === sizeName))
            return {
                status: 'FAILED',
                message: `Color: ${notExistedColor} and size: ${notExistedSize} not found`
            }
        }
        for (const variant of productVariantList) {
            const color = colors.find(color => color.name === variant.color)
            const size = sizes.find(size => size.name === variant.size)
            if (!color || !size) {
                return {
                    status: 'FAILED',
                    message: `Color: ${variant.color} or size: ${variant.size} not found`
                }
            }
            const productVariant = Object.assign(
                new ProductVariant(),
                variant,
                { color, size }
            );
            this.productVariantRepository.createProductVariant(productVariant);
        }
        return {
            status: 'SUCCESS',
            message: 'Create product variants successfully'
        }
    }

    subscribeEvents(payload: EventPayload): void {
        const { event, data } = payload;
        console.log('Event payload received: ', payload);

        switch (event) {
            case EventType.LAUNCH_DISCOUNT: {
                const { productIdList, discountValue } = data;
                this.launchDiscountOnProductVariant(productIdList, discountValue);
                break;
            }
            case EventType.END_DISCOUNT: {
                const { productIdList } = data;
                this.endDiscountOnProductVariant(productIdList);
                break;
            }
            default:
                return;
        }
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
            case RPCTypes.GET_PRODUCT_VARIANT_LIST_BY_ID_LIST: {
                const { productVariantIdList } = data as {
                    productVariantIdList: string[];
                };
                return this.serveRPCGetProductVariantListByIdList(
                    productVariantIdList
                );
            }
            case RPCTypes.FILTER_PRODUCT_BY_COLOR_AND_SIZE: {
                const filterOptions = data as VariantFilterRPCRequest;
                return this.retrieveProductByVariantFilterOptions(
                    filterOptions
                );
            }
            case RPCTypes.INVENTORY_CREATE_VARIANT: {
                return this.serveCreateVariantRPCRequest(data as CreateVariantRPCRequest)
            }
            default:
                throw new Error('Invalid RPC type');
        }
    }
}
