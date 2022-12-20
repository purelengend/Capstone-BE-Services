import { model, Schema } from 'mongoose';

export interface IProductModel {
    id?: string;
    name: string;
    description: string;
    basePrice: number;
    quantity: number;
    coverPhoto: string;
    photoUrls: string[];
    rating?: number;
    reviewed?: number;
    categories?: string[];
}

const productSchema = new Schema<IProductModel>(
    {   
        name: { type: String, required: true },
        description: { type: String, required: true },
        basePrice: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true },
        coverPhoto: { type: String, required: true },
        photoUrls: [{ type: String, required: false }],
        rating: { type: Number, required: false, default: 0 },
        reviewed: { type: Number, required: false, default: 0 },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    },
    {
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
            virtuals: true,
        },
        timestamps: true,
    }
);

export default model<IProductModel>('Product', productSchema);
