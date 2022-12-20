import { model, Schema } from "mongoose";

export interface ICategoryModel {
    id?: string;
    name: string;
    products?: string[]
};

const categorySchema = new Schema<ICategoryModel>(
    {
        name: { type: String, required: true },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
    },
    {
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        }
    }
);

export default model<ICategoryModel>('Category', categorySchema);
