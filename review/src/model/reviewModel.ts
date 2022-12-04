import { model, Schema } from 'mongoose';

export interface IUserModel {
    _id: string;
    name?: string;
    avatarUrl?: string;
}

export interface IReviewModel {
    authorId: string;
    productId: string;
    rating: number;
    comment: string;
    user?: IUserModel;
}

const reviewSchema = new Schema<IReviewModel>(
    {
        productId: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            _id: { type: String, required: false },
            name: { type: String, required: false },
            avatarUrl: { type: String, required: false },
        },
    },
    {
        toJSON: {
            transform(_, ret) {
                delete ret.__v;
            },
        },
        timestamps: true,
    }
);

export default model<IReviewModel>('Review', reviewSchema);
