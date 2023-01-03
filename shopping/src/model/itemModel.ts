import { Schema } from 'mongoose';

export interface IItemModel {
    productId: string;
    productVariantId: string;
    productName: string;
    productPhotoUrl: string;
    quantity: number;
}

export const itemSchema = new Schema<IItemModel>(
    {
        productId: { type: String, required: true },
        productVariantId: { type: String, required: true },
        productName: { type: String, required: true },
        productPhotoUrl: { type: String, required: true },
        quantity: { type: Number, required: true },
    },
    {
        toJSON: {
            transform(_, ret) {
                delete ret.__v;
                delete ret._id;
            },
        },
    }
);
