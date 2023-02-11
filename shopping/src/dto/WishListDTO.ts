import { IWishlistItemModel } from './../model/wishlistModel';

export class WishlistDTO {
    userId: string;
    itemList: IWishlistItemModel[];
}