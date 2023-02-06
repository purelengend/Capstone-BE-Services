import { model, Schema } from 'mongoose';

export interface IProductModel {
    id?: string;
    name: string;
    description: string;
    basePrice: number;
    sellingPrice: number;
    coverPhoto: string;
    photoUrls: string[];
    rating?: number;
    reviewed?: number;
    colors?: string[];
    sizes?: string[];
    categories?: string[];
}

const productSchema = new Schema<IProductModel>(
    {   
        name: { type: String, required: true },
        description: { type: String, required: true, text: true },
        basePrice: { type: Number, required: true, min: 0 },
        sellingPrice: { type: Number, required: false, min: 0 },
        coverPhoto: { type: String, required: true },
        photoUrls: [{ type: String, required: false }],
        rating: { type: Number, required: false, default: 0 },
        reviewed: { type: Number, required: false, default: 0 },
        colors: [{ type: String, required: false }],
        sizes: [{ type: String, required: false }],
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
