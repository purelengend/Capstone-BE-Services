import { model, Schema } from 'mongoose';

export interface IUserModel {
    id: string;
    username?: string;
    avatarUrl?: string;
}

export interface IReviewModel {
    id?: string;
    productId: string;
    rating: number;
    comment: string;
    user?: IUserModel;
}

const userSchema = new Schema<IUserModel>(
    {
        id: { type: String, required: true },
        username: { type: String, required: false },
        avatarUrl: { type: String, required: false },
    },
    {
        toJSON: {
            transform(_, ret) {
                delete ret._id;
                delete ret.__v;
            },
            virtuals: true,
        },
    }
);

const reviewSchema = new Schema<IReviewModel>(
    {
        productId: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: false },
        user: { type: userSchema, required: false },
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

export default model<IReviewModel>('Review', reviewSchema);
