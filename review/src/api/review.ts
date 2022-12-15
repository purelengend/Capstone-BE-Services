import { ValidationError } from './../error/error-type/ValidationError';
import { IReviewModel } from './../model/reviewModel';
import { Application, NextFunction, Request, Response } from 'express';
import { ReviewService } from '../service/reviewService';
import { Channel } from 'amqplib';
import subscribeMessage from './../message-queue/subscribeMessage';

export default (app: Application, channel: Channel) => {
    const reviewService = new ReviewService();

    subscribeMessage(channel, reviewService);

    // Get all reviews for a product by product id in query of request
    app.get('/api/reviews', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.query.productId as string;
            if (!productId) {
                throw new ValidationError('Missing productId in query');
            }

            const reviews = await reviewService.getReviewsByProductId(
                productId
            );
            return res.status(200).json(reviews);

        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/getByProductId/:id', async (_: Request, res: Response, next: NextFunction) => {
        try {
            const { id: productId } = _.params;
            if (!productId) {
                throw new ValidationError('Missing productId in query');
            }

            const reviews = await reviewService.getReviewsByProductId(
                productId
            );
            return res.status(200).json(reviews);
        } catch (error) {
            console.log('Error in getReviewsByProductId', error);
            next(error);
            return;
        }
    });

    app.post('/create', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId, rating, comment, authorId } = req.body;
            const review = {
                productId,
                rating,
                comment,
            } as IReviewModel;

            if (review && authorId) {
                const newReview = await reviewService.createReview(
                    review,
                    authorId
                );
                return res.status(200).json(newReview);
            } else {
                throw new ValidationError('Missing review or authorId in body');
            }
        } catch (error) {
            console.log('Error in create review', error);
            next(error);
            return;
        }
    });

    app.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { review } = req.body;
            if (!id || !review) {
                throw new ValidationError('Missing review or id in body');
            }

            const updatedReview = await reviewService.updateReview(
                id,
                review
            );
            return res.status(200).json(updatedReview);
        } catch (error) {
            console.log('Error in update review', error);
            next(error);
            return;
        }
    });

    app.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ValidationError('Missing id in body');
            }

            const deletedReview = await reviewService.deleteReview(id);
            return res.status(200).json(deletedReview);
        } catch (error) {
            console.log('Error in delete review', error);
            next(error);
            return;
        }
    });

    app.delete(
        '/deleteByProductId/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new ValidationError('Missing product id in body');
                }
                
                const deletedReviews =
                    await reviewService.deleteReviewsByProductId(id);
                return res.status(200).json(deletedReviews);
            } catch (error) {
                console.log('Error in delete reviews by product id', error);
                next(error);
                return;
            }
        }
    );

    app.delete('/deleteByAuthorId/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ValidationError('Missing author id in body');
            }
            
            const deletedReviews =
                await reviewService.deleteReviewsByUserId(id);
            res.status(200).json(deletedReviews);
        } catch (error) {
            console.log('Error in delete reviews by author id', error);
            next(error);
            return;
        }
    });
};
