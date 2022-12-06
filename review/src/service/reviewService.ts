// import { IUserModel } from './../model/reviewModel';
// import { USER_RPC } from './../config/index';
import { requestRPC } from './../message-queue/requestRPC';
import { EventPayload } from './../types/utilTypes';
import EventType from './../types/eventType';
import { ReviewRepository } from './../repository/reviewRepository';
import { IReviewModel } from '../model/reviewModel';
import { DeleteType } from '../types/utilTypes';
export class ReviewService implements IService {
    private reviewRepository: ReviewRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository();
    }

    async getReviewsByProductId(productId: string): Promise<IReviewModel[]> {
        try {
            return await this.reviewRepository.getReviewsByProductId(productId);
        } catch (error) {
            console.log('Error in getReviewsByProductId', error);
            throw error;
        }
    }

    async createReview(
        review: IReviewModel,
        userId: string
    ): Promise<IReviewModel> {
        try {
            const fakeAuthor = {
                _id: userId,
                name: 'fake name',
                avatarUrl: 'fake avatarUrl',
            };
            // const userResponse = (await requestRPC(USER_RPC, {
            //     type: 'GET-USER',
            //     data: userId,
            // })) as IUserModel;
            const productResponse = await requestRPC('PRODUCT_RPC', {
                type: 'GET_PRODUCT_BY_ID',
                data: {
                    id: review.productId,
                },
            });
            console.log('[*] product response from RPC: ', productResponse);

            return await this.reviewRepository.createReview(review, fakeAuthor);
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
            return await this.reviewRepository.updateReview(id, review);
        } catch (error) {
            console.log('Error in updateReview', error);
            throw new Error('Error in updateReview');
        }
    }

    async deleteReview(id: string): Promise<IReviewModel | null> {
        try {
            return await this.reviewRepository.deleteReview(id);
        } catch (error) {
            console.log('Error in deleteReview', error);
            throw new Error('Error in deleteReview');
        }
    }

    // Delete all reviews for a product
    async deleteReviewsByProductId(productId: string): Promise<DeleteType> {
        try {
            return await this.reviewRepository.deleteReviewsByProductId(
                productId
            );
        } catch (error) {
            console.log('Error in deleteReviewsByProductId', error);
            throw new Error('Error in deleteReviewsByProductId');
        }
    }

    // Delete all reviews by _id of author when the author is deleted, author is a field in review
    async deleteReviewsByUserId(authorId: string): Promise<DeleteType> {
        try {
            return await this.reviewRepository.deleteReviewsByAuthorId(
                authorId
            );
        } catch (error) {
            console.log('Error in deleteReviewsByAuthorId', error);
            throw new Error('Error in deleteReviewsByAuthorId');
        }
    }

    subscribeEvents(payload: string): void {
        const eventPayload: EventPayload = JSON.parse(payload);
        const { event, data } = eventPayload;

        switch (event) {
            case EventType.DELETE_USER:
                this.deleteReviewsByUserId(data?.userId);
                break;
            case EventType.DELETE_PRODUCT:
                this.deleteReviewsByProductId(data?.productId);
                break;
            default:
                break;
        }
    }
}
