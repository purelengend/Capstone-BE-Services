import { ICreateProductDto } from './../dto/IProductDto';
// import { verifyAdminAuthorization } from './../middleware/auth';
import { RetrieveProductRequest } from './../types/product';
import { Channel } from 'amqplib';
import { Application, NextFunction, Request, Response } from 'express';
import observerRPC from './../message-queue/rpc/observerRPC';
import ProductService from '../service/ProductService';
import publishMessage from '../message-queue/pub-sub/publishMessage';
import EventType from './../types/eventType';
import { REVIEW_SERVICE, DISCOUNT_SERVICE } from './../config';
import subscribeMessage from './../message-queue/pub-sub/subscribeMessage';

export default (app: Application, channel: Channel) => {
    const productService = new ProductService();
    
    observerRPC('PRODUCT_RPC', productService);
    subscribeMessage(channel, productService);
    subscribeMessage(channel, productService, DISCOUNT_SERVICE);

    app.get('/product/', async (_: Request, res: Response, next: NextFunction) => {
        try {
            const products = await productService.getProducts();
            return res.status(200).json(products);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/product/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await productService.getProductById(req.params.id);
            return res.status(200).json(product);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/product/search', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchTerm = req.body.searchTerm as string;
            if (!searchTerm || searchTerm.length < 2) {
                return res.status(200).json([]);
            }
            const products = await productService.searchProducts(searchTerm);
            return res.status(200).json(products);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post(
        '/product/create',
        // verifyAdminAuthorization,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const product = req.body as ICreateProductDto;
                const createdProduct = await productService.createProduct(
                    product
                );
                return res.status(200).json(createdProduct);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.put(
        '/product/update/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params.id;
                const product = req.body as ICreateProductDto;
                const updatedProduct = await productService.updateProduct(
                    id,
                    product
                );
                return res.status(200).json(updatedProduct);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.delete(
        '/product/delete/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params.id;
                const deletedProduct = await productService.deleteProduct(id);
                const payload = {
                    event: EventType.DELETE_PRODUCT,
                    data: {
                        productId: deletedProduct?.id,
                    },
                };
                publishMessage(channel, REVIEW_SERVICE, payload);
                return res.status(200).json(deletedProduct);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.post(
        '/product/retrieveProduct',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                let { page, pageSize, orderBy, sortBy, filters } =
                    req.body as RetrieveProductRequest;
                if ((!filters && !page) || !pageSize) {
                    page = 1;
                    pageSize = 10;
                }
                if (!sortBy) {
                    const retrieveResponse =
                        await productService.paginateProducts(page!, pageSize!);
                    return res.status(200).json(retrieveResponse);
                }
                if (!filters) {
                    if (!orderBy && !sortBy) {
                        throw new Error('Missing orderBy or sortBy');
                    }
                    const retrieveResponse = await productService.sortProducts(
                        page!,
                        pageSize!,
                        orderBy!,
                        sortBy
                    );
                    return res.status(200).json(retrieveResponse);
                }

                const retrieveResponse =
                    await productService.retrieveProductByFilters({
                        page,
                        pageSize,
                        orderBy,
                        sortBy,
                        filters,
                    });
                return res.status(200).json(retrieveResponse);
            } catch (error) {
                next(error);
                return;
            }
        }
    );
};
