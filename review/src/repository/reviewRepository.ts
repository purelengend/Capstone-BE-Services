import { NotFoundError } from './../error/error-type/NotFoundError';
import reviewModel, { IUserModel, IReviewModel } from '../model/reviewModel';
import { DeleteType } from '../types/utilTypes';

export class ReviewRepository {
    async getReviewsByProductId(productId: string): Promise<IReviewModel[]> {
        return await reviewModel.find({ productId });
    }

    async createReview(
        review: IReviewModel,
        author: IUserModel | undefined
    ): Promise<IReviewModel> {
        
        review.user = author;
        review = await new reviewModel(review).save();
        if (!review) {
            throw new Error('Review save failed in the database');
        }
        return review;
    }

    async updateReview(
        id: string,
        review: IReviewModel
    ): Promise<IReviewModel | null> {
        const updatedReview = await reviewModel.findByIdAndUpdate(id, review, {
            new: true,
        });
        if (!updatedReview) {
            throw new Error('Review update failed in the database');
        }
        return updatedReview;
    }

    async deleteReview(id: string): Promise<IReviewModel | null> {
        
        const deletedReview = await reviewModel.findByIdAndDelete(id);
        if (!deletedReview) {
            throw new NotFoundError('Review not found in the database');
        }
        return deletedReview;
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
