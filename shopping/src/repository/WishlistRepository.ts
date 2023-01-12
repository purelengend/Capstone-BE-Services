import { IWishlistModel } from './../model/wishlistModel';
import wishlistModel from './../model/wishlistModel';

export class WishlistRepository {
    async getAllWishlists(): Promise<IWishlistModel[]> {
        const wishlists = await wishlistModel.find();
        return wishlists;
    }

    async getWishlistByUserId(userId: string): Promise<IWishlistModel | null> {
        const wishlist = await wishlistModel.findOne({ userId });
        return wishlist;
    }

    async createWishlist(wishlist: IWishlistModel): Promise<IWishlistModel> {
        wishlist = await new wishlistModel(wishlist).save();
        return wishlist;
    }

    async updateWishlist(userId: string, wishlist: IWishlistModel) {
        const updatedWishlist = await wishlistModel.findOneAndUpdate(
            { userId },
            wishlist,
            {
                new: true,
            }
        );
        return updatedWishlist;
    }
}
