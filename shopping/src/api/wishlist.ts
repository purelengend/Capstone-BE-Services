import { AuthorizeError } from './../error/error-type/AuthorizedError';
import { ItemDTO } from './../dto/ItemDTO';
import { Application } from 'express';
import { WishlistService } from './../service/WishlistService';
import { decodeTokenInRequest } from './../middleware/auth';

export default (app: Application) => {
    const wishlistService = new WishlistService();

    app.get('/wishlist/all', (_, res) => {
        wishlistService.getAllWishlists().then((result) => {
            res.send(result);
        });
    });

    app.get('/wishlist/', async (req, res, next) => {
        try {
            const userId = req.query.userId as string;
            if (!userId) {
                throw new Error('Missing userId in query');
            }
            const decodedToken = decodeTokenInRequest(req);
            if (decodedToken && decodedToken.userId !== userId) {
                throw new AuthorizeError(
                    'User is not authorized to get wishlist'
                );
            }
            const cart = await wishlistService.getWishlistByUserId(userId);
            return res.status(200).json(cart);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.put('/addToWishlist', async (req, res, next) => {
        try {
            const { userId, itemDTO } = req.body as {
                userId: string;
                itemDTO: ItemDTO;
            };
            if (!userId || !itemDTO) {
                throw new Error('Missing userId or itemDTO in request body');
            }
            const decodedToken = decodeTokenInRequest(req);
            if (decodedToken && decodedToken.userId !== userId) {
                throw new AuthorizeError(
                    'User is not authorized to get wishlist'
                );
            }
            const newCart = await wishlistService.addItemToWishlist(
                userId,
                itemDTO
            );
            return res.status(200).json(newCart);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.put('/removeFromWishlist', async (req, res, next) => {
        try {
            const { userId, productVariantId } = req.body as {
                userId: string;
                productVariantId: string;
            };
            if (!userId || !productVariantId) {
                throw new Error('Missing userId or itemDTO in request body');
            }
            const newCart = await wishlistService.removeItemFromWishlist(
                userId,
                productVariantId
            );
            return res.status(200).json(newCart);
        } catch (error) {
            next(error);
            return;
        }
    });
};
