import { IWishlistModel } from './../model/wishlistModel';
import { WishlistRepository } from './../repository/WishlistRepository';
export class WishlistService {
    private wishlistRepository: WishlistRepository;

    constructor() {
        this.wishlistRepository = new WishlistRepository();
    }

    async getAllWishlists(): Promise<IWishlistModel[]> {
        return await this.wishlistRepository.getAllWishlists();
    }

    async getWishlistByUserId(userId: string): Promise<IWishlistModel | null> {
        return await this.wishlistRepository.getWishlistByUserId(userId);
    }

    // async addItemToWishlist(userId: string, productId: string): Promise<IWishlistModel | null> {
    //     // const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    //     // if (!wishlist) {
    //     //     return null;
    //     // }
    //     // if (wishlist.productIds.includes(productId)) {
    //     //     return wishlist;
    //     // }
    //     // wishlist.productIds.push(productId);
    //     // return await this.wishlistRepository.updateWishlist(userId, wishlist);
    //     return null;
    // }
}