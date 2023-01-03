import { Application } from 'express';
import { CartService } from './../service/CartService';

export default (app: Application) => {
    const cartService = new CartService();

    app.get('/cart/all', async (_, res, next) => {
        try {
            const carts = await cartService.getAllCarts();
            return res.status(200).json(carts);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/cart', async (req, res, next) => {
        try {
            const userId = req.query.userId as string;
            if (!userId) {
                throw new Error('Missing userId in query');
            }
            const cart = await cartService.getCartByUserId(userId);
            return res.status(200).json(cart);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/addToCart', async (req, res, next) => {
        try {
            const { userId, itemDTO } = req.body;
            if (!userId || !itemDTO) {
                throw new Error('Missing userId or itemDTO in body');
            }
            const newCart = await cartService.addItemToCart(userId, itemDTO);
            return res.status(200).json(newCart);
        } catch (error) {
            next(error);
            return;
        }
    });
};
