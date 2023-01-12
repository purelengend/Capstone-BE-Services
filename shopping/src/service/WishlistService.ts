import { IItemModel } from './../model/itemModel';
import { ItemDTO } from './../dto/ItemDTO';
import { IReplyProductVariant } from './../types/rpcInventoryType';
import { INVENTORY_RPC } from './../config/index';
import { RPCTypes } from './../types/rpcType';
import { WishlistDTO } from './../dto/WishListDTO';
import { IWishlistModel } from './../model/wishlistModel';
import { WishlistRepository } from './../repository/WishlistRepository';
import { requestRPC } from './../message-queue/rpc/requestRPC';
export class WishlistService {
    private wishlistRepository: WishlistRepository;

    constructor() {
        this.wishlistRepository = new WishlistRepository();
    }

    async getAllWishlists(): Promise<IWishlistModel[]> {
        return await this.wishlistRepository.getAllWishlists();
    }

    async getWishlistByUserId(userId: string): Promise<WishlistDTO | null> {
        const wishListModel = await this.wishlistRepository.getWishlistByUserId(userId);
        if (!wishListModel) {
            return null;
        }
        const productVariantIdList = wishListModel.itemList.map(
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
        console.log("rpcProductVariantList reply: ", rpcProductVariantList);

        const productVariantMap = rpcProductVariantList.reduce(
            (acc, productVariant) => {
                acc.set(productVariant.id, productVariant);
                return acc;
            },
            new Map<string, IReplyProductVariant>()
        );
        const itemModelList = wishListModel.itemList;

        const itemDTOList = itemModelList.map((item) => {
            const productVariant = productVariantMap.get(item.productVariantId);
            const { color, size, sellingPrice } = productVariant!;
            return {
                productId: item.productId,
                productName: item.productName,
                productPhotoUrl: item.productPhotoUrl,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                color,
                size,
                sellingPrice,
            };
        }) as ItemDTO[];

        return {
            userId: wishListModel.userId,
            itemList: itemDTOList,
        };
    }

    async addItemToWishlist(
        userId: string,
        itemDTO: ItemDTO
    ): Promise<WishlistDTO | null> {
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
        if (!rpcAddedProductVariant) {
            return null;
        }
        
        const addItem: IItemModel = {
            ...itemDTO,
            productVariantId: rpcAddedProductVariant.id,
        };
        let wishlistModel = await this.wishlistRepository.getWishlistByUserId(
            userId
        );

        if (!wishlistModel) {
            wishlistModel = await this.wishlistRepository.createWishlist(
                {
                    userId,
                    itemList: [addItem],
                }
            );
        } else {
            const itemIndex = wishlistModel.itemList.findIndex(
                (item) => item.productVariantId === addItem.productVariantId
            );
            if (itemIndex === -1) {
                wishlistModel.itemList.push(addItem);
            } else {
                wishlistModel.itemList[itemIndex].quantity += addItem.quantity;
            }
            wishlistModel = await this.wishlistRepository.updateWishlist(
                userId,
                wishlistModel
            );
        }
        return this.getWishlistByUserId(userId);
    }

    async removeItemFromWishlist(
        userId: string,
        productVariantId: string
    ): Promise<WishlistDTO | null> {
        const wishlistModel = await this.wishlistRepository.getWishlistByUserId(
            userId
        );
        if (!wishlistModel) {
            return null;
        }
        wishlistModel.itemList = wishlistModel.itemList.filter(
            (item) => item.productVariantId !== productVariantId
        );
        await this.wishlistRepository.updateWishlist(userId, wishlistModel);
        return this.getWishlistByUserId(userId);
    }
}