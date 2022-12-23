import { Channel } from 'amqplib';
import { Application, NextFunction, Request, Response } from 'express';
import observerRPC from './../message-queue/rpc/observerRPC';
import { IProductModel } from '../model/productModel';
import ProductService from '../service/ProductService';
import publishMessage from '../message-queue/pub-sub/publishMessage';
import EventType from './../types/eventType';
import { REVIEW_SERVICE } from './../config';
import subscribeMessage from './../message-queue/pub-sub/subscribeMessage';

export default (app: Application, channel: Channel) => {
    const productService = new ProductService();

    observerRPC('PRODUCT_RPC', productService);
    subscribeMessage(channel, productService);

    app.get('/', async (_: Request, res: Response, next: NextFunction) => {
        try {
            const products = await productService.getProducts();
            return res.status(200).json(products);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await productService.getProductById(req.params.id);
            return res.status(200).json(product);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/create', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = req.body as IProductModel;
            const createdProduct = await productService.createProduct(product);
            return res.status(200).json(createdProduct);
        } catch (error) {
            next(error)
            return;
        }
    });

    app.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const product = req.body as IProductModel;
            const updatedProduct = await productService.updateProduct(id, product);
            return res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const deletedProduct = await productService.deleteProduct(id);
            const payload = {
                event: EventType.DELETE_PRODUCT,
                data: {
                    productId: deletedProduct?.id
                }
            }
            publishMessage(channel, REVIEW_SERVICE, payload)
            return res.status(200).json(deletedProduct);
        } catch (error) {
            next(error)
            return;
        }
    });
};
