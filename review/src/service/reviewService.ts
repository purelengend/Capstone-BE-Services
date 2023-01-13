import { RPCTypes } from './../types/rpcType';
import { NotFoundError } from './../error/error-type/NotFoundError';
import { USER_RPC } from './../config/index';
import { requestRPC } from './../message-queue/rpc/requestRPC';
import { EventPayload, RPCPayload } from './../types/utilTypes';
import EventType from './../types/eventType';
import { ReviewRepository } from './../repository/reviewRepository';
import { IReviewModel, IUserModel } from './../model/reviewModel';
import { DeleteType } from '../types/utilTypes';
import { IService } from './IService';
export class ReviewService implements IService {
    private reviewRepository: ReviewRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository();
    }

    async getReviewsByProductId(productId: string): Promise<IReviewModel[]> {
        return await this.reviewRepository.getReviewsByProductId(productId);
    }

    async createReview(
        review: IReviewModel,
        userId: string
    ): Promise<IReviewModel> {
        // const fakeAuthor = {
        //     id: userId,
        //     username: 'fake name',
        //     avatarUrl: 'fake avatarUrl',
        // };
        const userResponse = (await requestRPC(USER_RPC, {
            type: RPCTypes.GET_USER_INFO_BY_USER_ID,
            data: userId,
        })) as IUserModel;
        // const productResponse = await requestRPC('PRODUCT_RPC', {
        //     type: 'GET_PRODUCT_BY_ID',
        //     data: {
        //         id: review.productId,
        //     },
        // });
        if (!userResponse) {
            throw new NotFoundError('User not found');
        }
        console.log('[*] userResponse response from RPC: ', userResponse);

        return await this.reviewRepository.createReview(review, userResponse);
    }

    async updateReview(
        id: string,
        review: IReviewModel
    ): Promise<IReviewModel | null> {
        return await this.reviewRepository.updateReview(id, review);
    }

    async deleteReview(id: string): Promise<IReviewModel | null> {
        return await this.reviewRepository.deleteReview(id);
    }

    // Delete all reviews for a product
    async deleteReviewsByProductId(productId: string): Promise<DeleteType> {
        return await this.reviewRepository.deleteReviewsByProductId(productId);
    }

    // Delete all reviews by _id of author when the author is deleted, author is a field in review
    async deleteReviewsByUserId(authorId: string): Promise<DeleteType> {
        return await this.reviewRepository.deleteReviewsByAuthorId(authorId);
    }

    async getAverageRatingByProductId(productId: string): Promise<number> {
        return await this.reviewRepository.getAverageRatingByProductId(
            productId
        );
    }

    async getReviewAnalysisByProductId(
        productId: string
    ): Promise<{ averageRating: number; reviewCount: number }> {
        return await this.reviewRepository.getAverageRatingAndCountByProductId(
            productId
        );
    }

    serveRPCRequest(_: RPCPayload) {
        throw new Error('Method not implemented.');
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
