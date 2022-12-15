import { Channel } from 'amqplib';
import { Application, NextFunction, Request, Response } from 'express';
import observerRPC from './../message-queue/rpc/observerRPC';
import { IProductModel } from '../model/productModel';
import ProductService from '../service/ProductService';

export default (app: Application, _: Channel) => {
    const productService = new ProductService();

    observerRPC('PRODUCT_RPC', productService);

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
            const data = await productService.createProduct(product);
            return res.status(200).json(data);
        } catch (error) {
            next(error)
            return;
        }
    });

    app.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const product = req.body as IProductModel;
            const data = await productService.updateProduct(id, product);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const data = await productService.deleteProduct(id);
            return res.json(data);
        } catch (error) {
            next(error)
            return;
        }
    });
};
