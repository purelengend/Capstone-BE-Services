import reviewModel, { IUserModel, IReviewModel } from '../model/reviewModel';
import { DeleteType } from '../types/utilTypes';

export class ReviewRepository {
    async getReviewsByProductId(productId: string): Promise<IReviewModel[]> {
        try {
            return await reviewModel.find({ productId });
        } catch (error) {
            console.log('Error in getReviewsByProductId', error);
            throw error;
        }
    }

    async createReview(
        review: IReviewModel,
        author: IUserModel | undefined
    ): Promise<IReviewModel> {
        try {
            review.user = author;
            return await new reviewModel(review).save();
        } catch (error) {
            console.log('Error in createReview', error);
            throw error;
        }
    }

    async updateReview(
        id: string,
        review: IReviewModel
    ): Promise<IReviewModel | null> {
        try {
            return await reviewModel.findByIdAndUpdate(id, review, {
                new: true,
            });
        } catch (error) {
            console.log('Error in updateReview', error);
            throw new Error('Error in updateReview');
        }
    }

    async deleteReview(id: string): Promise<IReviewModel | null> {
        try {
            return await reviewModel.findByIdAndDelete(id);
        } catch (error) {
            console.log('Error in deleteReview', error);
            throw new Error('Error in deleteReview');
        }
    }

    // Delete all reviews for a product
    async deleteReviewsByProductId(productId: string): Promise<DeleteType> {
        try {
            const data = await reviewModel.deleteMany({ productId });
            console.log('return data of delete reviews by productId', data);
            return data;
        } catch (error) {
            console.log('Error in deleteReviewsByProductId', error);
            throw new Error('Error in deleteReviewsByProductId');
        }
    }

    // Delete all reviews by _id of author when the author is deleted, author is a field in review
    async deleteReviewsByAuthorId(authorId: string): Promise<DeleteType> {
        try {
            const data = await reviewModel.deleteMany({
                'author._id': authorId,
            });
            console.log('return data of delete reviews by authorId', data);
            return data;
        } catch (error) {
            console.log('Error in deleteReviewsByAuthorId', error);
            throw new Error('Error in deleteReviewsByAuthorId');
        }
    }
}
