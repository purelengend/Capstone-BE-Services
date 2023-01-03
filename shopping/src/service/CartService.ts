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
        const productVariantIdList = cart.itemList.map(item => item.productVariantId);
        const productVariantList = await requestRPC(INVENTORY_RPC, { productVariantIdList }) as ItemDTO[] ?? [];
        return {
            userId: cart.userId,
            itemList: productVariantList,
        }
    }

    async createCart(cart: ICartModel): Promise<ICartModel> {
        return await this.cartRepository.createCart(cart);
    }
    
    async updateCart(userId: string, cart: ICartModel): Promise<ICartModel | null> {
        return await this.cartRepository.updateCart(userId, cart);
    }

    async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<CartDTO | null> {
        const {productId, color, size} = itemDTO;
        const addedProductVariant: IReplyProductVariant = await requestRPC(INVENTORY_RPC, { productId, color, size }) as IReplyProductVariant;
        const addItem: IItemModel = {
            ...itemDTO,
            productVariantId: addedProductVariant.productVariantId,
        }
        let cartModel = await this.cartRepository.getCartByUserId(userId);
        if (!cartModel) {
            cartModel  = await this.cartRepository.createCart({
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