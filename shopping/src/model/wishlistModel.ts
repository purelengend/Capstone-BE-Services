import { model, Schema } from "mongoose";
import { IItemModel, itemSchema } from "./itemModel";

export interface IWishlistModel {
    id?: string;
    userId: string;
    itemList: IItemModel[];
}

export const wishlistSchema = new Schema<IWishlistModel>(
    {
        userId: { type: String, required: true, unique: true },
        itemList: { type: [itemSchema], required: true, default: [] },
    },
    {
        toJSON: {
            transform(_, ret) {
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

export default model<IWishlistModel>('Wishlist', wishlistSchema);