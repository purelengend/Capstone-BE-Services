import { ICategoryModel } from './categoryModel';
import { model, Schema } from 'mongoose';

export interface IProductModel {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category?: ICategoryModel[];
}

const productSchema = new Schema<IProductModel>(
    {   
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        image: { type: String, required: true },
        category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    },
    {
        toJSON: {
            transform(_, ret) {
                delete ret.__v;
                this.virtuals = true;
            },
        },
        timestamps: true,
    }
);

export default model<IProductModel>('Product', productSchema);
