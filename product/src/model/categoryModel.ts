import { IProductModel } from "./productModel";
import { model, Schema } from "mongoose";

export interface ICategoryModel {
    name: string;
    product?: IProductModel[]
};

const categorySchema = new Schema<ICategoryModel>(
    {
        name: { type: String, required: true },
        product: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
    },
    {
        toJSON: {
            transform(_, ret) {
                delete ret.__v;
            }
        }
    }
);

export default model<ICategoryModel>('Category', categorySchema);
