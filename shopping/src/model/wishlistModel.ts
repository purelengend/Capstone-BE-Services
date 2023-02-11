import { model, Schema } from "mongoose";

export interface IWishlistItemModel {
    productId: string;
    productName: string;
    productPhotoUrl: string;
}

export interface IWishlistModel {
    id?: string;
    userId: string;
    itemList: IWishlistItemModel[];
}

const wishlistItemSchema = new Schema<IWishlistItemModel>(
    {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        productPhotoUrl: { type: String, required: true },
    },
    {
        toJSON: {
            transform(_, ret) {

                delete ret.__v;
                delete ret._id;
                delete ret.__parentArray;
                delete ret.__index;
                delete ret.$__parent;
                delete ret.$__;
                delete ret._doc;
                delete ret.$isNew;
                // delete ret[Symbol(documentArrayParent)];
            },
        },
        virtuals: true,
    }
);

export const wishlistSchema = new Schema<IWishlistModel>(
    {
        userId: { type: String, required: true, unique: true },
        itemList: { type: [wishlistItemSchema], required: true, default: [] },
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