import { model, Schema } from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
},{
    toJSON: {
        transform(_, ret){
            delete ret.__v;
        }
    },
    timestamps: true});

export default model<IProduct>("Product", productSchema);