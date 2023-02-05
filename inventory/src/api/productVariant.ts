import { INVENTORY_RPC, DISCOUNT_SERVICE } from '../config/index';
import { Application, Request, Response, NextFunction } from 'express';
import { ProductVariantService } from '../service/ProductVariantService';
import CreateProductVariantDTO from '../dto/CreateProductVariantDTO';
import observerRPC from '../message-queue/rpc/observerRPC';
import subscribeMessage from './../message-queue/pub-sub/subscribeMessage';
import { Channel } from 'amqplib';
import UpdateProductVariantDTO from './../dto/UpdateProductVariantDTO';

export default (app: Application, channel: Channel): void => {
    const productVariantService = new ProductVariantService();

    observerRPC(INVENTORY_RPC, productVariantService);
    subscribeMessage(channel, productVariantService);
    subscribeMessage(channel, productVariantService, DISCOUNT_SERVICE);

    app.get(
        '/productVariant/all',
        async (_: Request, res: Response, next: NextFunction) => {
            try {
                const sizes = await productVariantService.getAll();
                return res.status(200).json(sizes);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.get(
        '/productVariant/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const size = await productVariantService.findById(
                    req.params.id
                );
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.get('/productVariant/stock', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId, sizeName, colorName } = req.query;
            if (!productId || !sizeName || !colorName) {
                throw new Error('Missing query params');
            }
            return res.status(200).json(await 
                productVariantService
                .getStockQuantityByProductIdAndColorAndSize(
                    productId.toString(), 
                    colorName.toString(), 
                    sizeName.toString()));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post(
        '/productVariant',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const productVariant = req.body as CreateProductVariantDTO;
                const createdProductVariant =
                    await productVariantService.createProductVariant(
                        productVariant
                    );
                return res.status(200).json(createdProductVariant);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.put(
        '/productVariant/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                console.log(req.body);

                const productVariant = req.body as UpdateProductVariantDTO;
                console.log(productVariant);
                const updatedProductVariant =
                    await productVariantService.updateProductVariant(
                        req.params.id,
                        productVariant
                    );
                return res.status(200).json(updatedProductVariant);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.get(
        '/productVariantReverse',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const productVariantPayload = req.body;
                const productVariant =
                    await productVariantService.reserveProductVariantsQuantity(
                        productVariantPayload
                    );
                return res.status(200).json(productVariant);
            } catch (error) {
                next(error);
                return;
            }
        }
    );
};
