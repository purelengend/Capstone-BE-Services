import { NotFoundError } from './../error/error-type/NotFoundError';
import reviewModel, { IUserModel, IReviewModel } from '../model/reviewModel';
import { DeleteType } from '../types/utilTypes';

export class ReviewRepository {
    async getReviewsByProductId(productId: string): Promise<IReviewModel[]> {
        try {
            return await reviewModel.find({ productId });
        } catch (error) {
            throw new NotFoundError(
                `Reviews for product ${productId} not found`
            );
        }
    }

    async createReview(
        review: IReviewModel,
        author: IUserModel | undefined
    ): Promise<IReviewModel> {
        try {
            review.user = author;
            review = await new reviewModel(review).save();
            return review;
        } catch (error) {
            throw new Error('Review creation failed in the database');
        }
    }

    async updateReview(
        id: string,
        review: IReviewModel
    ): Promise<IReviewModel | null> {
        try {
            const updatedReview = await reviewModel.findByIdAndUpdate(
                id,
                review,
                {
                    new: true,
                }
            );
            return updatedReview;
        } catch (error) {
            throw new Error('Review update failed in the database');
        }
    }

    async deleteReview(id: string): Promise<IReviewModel | null> {
        try {
            const deletedReview = await reviewModel.findByIdAndDelete(id);
            return deletedReview;
        } catch (error) {
            throw new Error('Review delete failed in the database');
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
    async deleteReviewsByAuthorId(userId: string): Promise<DeleteType> {
        try {
            const data = await reviewModel.deleteMany({
                'user._id': userId,
            });
            console.log('return data of delete reviews by userId', data);
            return data;
        } catch (error) {
            console.log('Error in deleteReviewsByAuthorId', error);
            throw new Error('Error in deleteReviewsByAuthorId');
        }
    }

    async getReviewCountByProductId(productId: string): Promise<number> {
        try {
            const count = await reviewModel.countDocuments({ productId });
            return count;
        } catch (error) {
            throw new Error('Error in getCountReviewsByProductId');
        }
    }

    async getReviewCountsOfAllProducts(): Promise<any> {
        try {
            const count = await reviewModel.aggregate([
                {
                    $group: {
                        _id: '$productId',
                        count: { $sum: 1 },
                    },
                },
            ]);
            return count;
        } catch (error) {
            throw new Error('Error in getReviewCountsOfAllProducts');
        }
    }

    async getAverageRatingByProductId(productId: string): Promise<number> {
        try {
            const averageRating = await reviewModel.aggregate([
                {
                    $match: { productId },
                },
                {
                    $group: {
                        _id: '$productId',
                        averageRating: { $avg: '$rating' },
                    },
                },
            ]);
            return averageRating[0].averageRating;
        } catch (error) {
            throw new Error('Error in getAverageRatingByProductId');
        }
    }

    async getAllAverageRatingOfAllProducts(): Promise<any> {
        try {
            const averageRating = await reviewModel.aggregate([
                {
                    $group: {
                        _id: '$productId',
                        averageRating: { $avg: '$rating' },
                    },
                },
            ]);
            return averageRating;
        } catch (error) {
            throw new Error('Error in getAllAverageRatingOfAllProducts');
        }
    }

    async getAverageRatingAndCountByProductId(
        productId: string
    ): Promise<{ averageRating: number; reviewCount: number }> {
        try {
            const averageRating = this.getAverageRatingByProductId(productId);
            const count = this.getReviewCountByProductId(productId);
            const values_1 = await Promise.all([averageRating, count]);
            return {
                averageRating: values_1[0],
                reviewCount: values_1[1],
            };
        } catch (error) {
            throw new Error('Error in getAverageRatingAndCountByProductId');
        }
    }
}
