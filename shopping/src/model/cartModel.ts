import { model, Schema } from "mongoose";
import { IItemModel, itemSchema } from "./itemModel";

export interface ICartModel {
    id?: string;
    userId: string;
    itemList: IItemModel[];
}

const cartSchema = new Schema<ICartModel>(
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
        },
        timestamps: true,
    }
);

export default model<ICartModel>('Cart', cartSchema);