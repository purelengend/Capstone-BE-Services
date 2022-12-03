import { Application, Request, Response } from 'express';
import { IProductModel } from '../model/productModel';
import ProductService from '../service/productService';

export default (app: Application) => {
    const productService = new ProductService();

    app.get('/', async (_: Request, res: Response) => {
        const products = await productService.getProducts();
        return res.json(products);
    });

    app.get('/:id', async (req: Request, res: Response) => {
        const product = await productService.getProduct(req.params.id);
        return res.json(product);
    });

    app.post('/create', async (req: Request, res: Response) => {
        const product = req.body as IProductModel;
        const data = await productService.createProduct(product);
        return res.json(data);
    });

    app.put('/update/:id', async (req: Request, res: Response) => {
        const id = req.params.id;
        const product = req.body as IProductModel;
        const data = await productService.updateProduct(id, product);
        return res.json(data);
    });

    app.delete('/delete/:id', async (req: Request, res: Response) => {
        const id = req.params.id;
        const data = await productService.deleteProduct(id);
        return res.json(data);
    });
};
