import { RPCTypes } from './../types/rpcType';
import { IItemModel } from './../model/itemModel';
import { IReplyProductVariant } from './../types/rpcInventoryType';
import { CartDTO } from './../dto/CartDTO';
import { INVENTORY_RPC } from './../config/index';
import { ItemDTO } from './../dto/ItemDTO';
import { ICartModel } from './../model/cartModel';
import { CartRepository } from './../repository/CartRepository';
import { requestRPC } from './../message-queue/rpc/requestRPC';

export class CartService {
    private cartRepository: CartRepository;

    constructor() {
        this.cartRepository = new CartRepository();
    }

    async getAllCarts(): Promise<ICartModel[]> {
        return await this.cartRepository.getAllCarts();
    }

    async getCartByUserId(userId: string): Promise<CartDTO | null> {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            return null;
        }
        const productVariantIdList = cart.itemList.map(
            (item) => item.productVariantId
        );
        const requestRPCpayload = {
            type: RPCTypes.GET_PRODUCT_VARIANT_LIST_BY_ID_LIST,
            data: {
                productVariantIdList,
            },
        };
        const rpcProductVariantList =
            ((await requestRPC(
                INVENTORY_RPC,
                requestRPCpayload
            )) as IReplyProductVariant[]) ?? [];
        const productVariantMap = rpcProductVariantList.reduce(
            (acc, productVariant) => {
                acc.set(productVariant.id, productVariant);
                return acc;
            },
            new Map<string, IReplyProductVariant>()
        );
        const itemList = cart.itemList.map((item) => {
            const productVariant = productVariantMap.get(item.productVariantId);
            const { color, size, sellingPrice } = productVariant!;
            return {
                ...item,
                color,
                size,
                sellingPrice,
            };
        }) as ItemDTO[];
        return {
            userId: cart.userId,
            itemList,
        };
    }

    async createCart(cart: ICartModel): Promise<ICartModel> {
        return await this.cartRepository.createCart(cart);
    }

    async updateCart(
        userId: string,
        cart: ICartModel
    ): Promise<ICartModel | null> {
        return await this.cartRepository.updateCart(userId, cart);
    }

    async addItemToCart(
        userId: string,
        itemDTO: ItemDTO
    ): Promise<CartDTO | null> {
        const { productId, color, size } = itemDTO;
        const requestRPCPayload = {
            type: RPCTypes.GET_PRODUCT_VARIANT_BY_PRODUCT_ID_COLOR_SIZE,
            data: {
                productId,
                color,
                size,
            },
        };
        const rpcAddedProductVariant = (await requestRPC(
            INVENTORY_RPC,
            requestRPCPayload
        )) as IReplyProductVariant;
        const addItem: IItemModel = {
            ...itemDTO,
            productVariantId: rpcAddedProductVariant.id,
        };
        let cartModel = await this.cartRepository.getCartByUserId(userId);
        if (!cartModel) {
            cartModel = await this.cartRepository.createCart({
                userId,
                itemList: [addItem],
            });
        }
        cartModel.itemList.push(addItem);
        cartModel = await this.cartRepository.updateCart(userId, cartModel);

        let cartDTO = await this.getCartByUserId(userId);

        return cartDTO;
    }
}
