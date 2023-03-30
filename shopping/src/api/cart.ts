import { UserRoleType } from './../types/auth';
import { AuthorizeError } from './../error/error-type/AuthorizedError';
import { decodeTokenInRequest } from './../middleware/auth';
import { ItemDTO } from './../dto/ItemDTO';
import { Application } from 'express';
import { CartService } from './../service/CartService';

export default (app: Application) => {
    const cartService = new CartService();

    app.get('/shopping/cart/all', async (_, res, next) => {
        try {
            const carts = await cartService.getAllCarts();
            return res.status(200).json(carts);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/shopping/cart', async (req, res, next) => {
        try {
            const userId = req.query.userId as string;
            if (!userId) {
                throw new Error('Missing userId in query');
            }
            const decodedToken = decodeTokenInRequest(req);
        
            if (decodedToken.userId !== userId && decodedToken.role !== UserRoleType.ADMIN) {
                throw new AuthorizeError('User is not authorized to get cart');
            }
            const cart = await cartService.getCartByUserId(userId);
            return res.status(200).json(cart);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/shopping/addToCart', async (req, res, next) => {
        try {
            const { userId, itemDTO } = req.body as {
                userId: string;
                itemDTO: ItemDTO;
            };
            if (!userId || !itemDTO) {
                throw new Error('Missing userId or itemDTO in request body');
            }
            const decodedToken = decodeTokenInRequest(req);
            if (decodedToken.userId !== userId) {
                throw new AuthorizeError(
                    'User is not authorized to add item to cart'
                );
            }
            const newCart = await cartService.addItemToCart(userId, itemDTO);
            return res.status(200).json(newCart);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.put('/shopping/removeFromCart', async (req, res, next) => {
        try {
            const { userId, productVariantId } = req.body as {
                userId: string;
                productVariantId: string;
            };
            if (!userId || !productVariantId) {
                throw new Error('Missing userId or itemDTO in request body');
            }
            const newCart = await cartService.removeItemFromCart(
                userId,
                productVariantId
            );
            return res.status(200).json(newCart);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.put('/shopping/updateCartItemQuantity', async (req, res, next) => {
        try {
            const { userId, productVariantId, quantity } = req.body as {
                userId: string;
                productVariantId: string;
                quantity: number;
            };
            if (!userId || !productVariantId || !quantity) {
                throw new Error('Missing userId or itemDTO in request body');
            }
            if (quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }
            const updatedCart = await cartService.updateItemQuantity(
                userId,
                productVariantId,
                quantity
            );
            return res.status(200).json(updatedCart);
        } catch (error) {
            next(error);
            return;
        }
    });
};
