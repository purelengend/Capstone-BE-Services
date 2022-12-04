import { IReviewModel } from './../model/reviewModel';
import { Application, Request, Response } from 'express';
import { ReviewService } from '../service/reviewService';
import { Channel } from 'amqplib';
import subscribeMessage from './../message-queue/subscribeMessage';

export default (app: Application, channel: Channel) => {
    const reviewService = new ReviewService();

    subscribeMessage(channel, reviewService);

    // Get all reviews for a product by product id in query of request
    app.get('/api/reviews', async (req: Request, res: Response) => {
        try {
            const productId = req.query.productId as string;
            if (productId) {
                const reviews = await reviewService.getReviewsByProductId(
                    productId
                );
                res.status(200).json(reviews);
            } else {
                res.status(400).send('Missing productId in query');
            }
        } catch (error) {
            console.log('Error in get reviews', error);
            res.status(500).send(error);
        }
    });

    app.get('/getByProductId/:id', async (_: Request, res: Response) => {
        try {
            const { id: productId } = _.params;
            if (productId) {
                const reviews = await reviewService.getReviewsByProductId(
                    productId
                );
                res.status(200).json(reviews);
            } else {
                res.status(400).send('Missing productId in query');
            }
        } catch (error) {
            console.log('Error in getReviewsByProductId', error);
            res.status(500).json(error);
        }
    });

    app.post('/create', async (req: Request, res: Response) => {
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
                res.status(200).json(newReview);
            } else {
                res.status(400).send('Missing review or authorId in body');
            }
        } catch (error) {
            console.log('Error in create review', error);
            res.status(500).json(error);
        }
    });

    app.put('/update/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { review } = req.body;
            if (id && review) {
                const updatedReview = await reviewService.updateReview(
                    id,
                    review
                );
                res.status(200).json(updatedReview);
            } else {
                res.status(400).send('Missing review or id in body');
            }
        } catch (error) {
            console.log('Error in update review', error);
            res.status(500).json(error);
        }
    });

    app.delete('/delete/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (id) {
                const deletedReview = await reviewService.deleteReview(id);
                res.status(200).json(deletedReview);
            } else {
                res.status(400).send('Missing id in body');
            }
        } catch (error) {
            console.log('Error in delete review', error);
            res.status(500).json(error);
        }
    });

    app.delete(
        '/deleteByProductId/:id',
        async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                if (id) {
                    const deletedReviews =
                        await reviewService.deleteReviewsByProductId(id);
                    res.status(200).json(deletedReviews);
                } else {
                    res.status(400).send('Missing id in body');
                }
            } catch (error) {
                console.log('Error in delete reviews by product id', error);
                res.status(500).json(error);
            }
        }
    );

    app.delete('/deleteByAuthorId/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (id) {
                const deletedReviews =
                    await reviewService.deleteReviewsByUserId(id);
                res.status(200).json(deletedReviews);
            } else {
                res.status(400).send('Missing id in body');
            }
        } catch (error) {
            console.log('Error in delete reviews by author id', error);
            res.status(500).json(error);
        }
    });
};
