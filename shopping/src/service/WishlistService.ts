import { NotFoundError } from './../error/error-type/NotFoundError';
import { WishlistDTO } from './../dto/WishListDTO';
import { IWishlistItemModel, IWishlistModel } from './../model/wishlistModel';
import { WishlistRepository } from './../repository/WishlistRepository';

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
            throw new NotFoundError("Wishlist not found");
        }
        return wishListModel;
    }

    async toggleAddItemToWishlist(
        userId: string,
        item: IWishlistItemModel
    ): Promise<WishlistDTO | null> {    
        let wishlistModel = await this.wishlistRepository.getWishlistByUserId(
            userId
        );

        if (!wishlistModel) {
            wishlistModel = await this.wishlistRepository.createWishlist(
                {
                    userId,
                    itemList: [item],
                }
            );
        } else {
            const itemIndex = wishlistModel.itemList.findIndex(
                (existingItem) => existingItem.productId === item.productId
            );
            if (itemIndex === -1) {
                wishlistModel.itemList.push(item);
            } else {
                wishlistModel.itemList.splice(itemIndex, 1);
            }
            wishlistModel = await this.wishlistRepository.updateWishlist(
                userId,
                wishlistModel
            );
        }
        return wishlistModel;
    }

    async removeItemFromWishlist(
        userId: string,
        productId: string
    ): Promise<WishlistDTO | null> {
        const wishlistModel = await this.wishlistRepository.getWishlistByUserId(
            userId
        );
        if (!wishlistModel) {
            return null;
        }
        wishlistModel.itemList = wishlistModel.itemList.filter(
            (item) => item.productId !== productId
        );
        return await this.wishlistRepository.updateWishlist(userId, wishlistModel);
    }

    async checkItemInWishlist(
        userId: string,
        productId: string
    ): Promise<boolean> {
        const wishlistModel = await this.wishlistRepository.getWishlistByUserId(
            userId
        );
        if (!wishlistModel) {
            return false;
        }
        const itemIndex = wishlistModel.itemList.findIndex(
            (item) => item.productId === productId
        );
        return itemIndex !== -1;
    }

}