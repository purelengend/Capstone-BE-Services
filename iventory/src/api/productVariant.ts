import { INVENTORY_RPC } from './../config/index';
import { Application, Request, Response, NextFunction } from "express";
import { ProductVariantService } from "./../service/ProductVariantService";
import CreateProductVariantDTO from '../dto/CreateProductVariantDTO';
import observerRPC from "./../message-queue/rpc/observerRPC";

export default (app: Application): void => {
    const productVariantService = new ProductVariantService();

    observerRPC(INVENTORY_RPC, productVariantService);

    app.get("/productVariant/all", async (_: Request, res: Response, next: NextFunction) => {
        try {
            const sizes = await productVariantService.getAll();
            return res.status(200).json(sizes);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get("/productVariant/:id", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const size = await productVariantService.findById(req.params.name);
            return res.status(200).json(size);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post("/productVariant", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productVariant = req.body as CreateProductVariantDTO;
            const createdProductVariant = await productVariantService.createProductVariant(productVariant);
            return res.status(200).json(createdProductVariant);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.put("/productVariant/:id", async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);
            
            const productVariant = req.body as CreateProductVariantDTO;
            console.log(productVariant);
            const updatedProductVariant = await productVariantService.updateProductVariant(req.params.id, productVariant);
            return res.status(200).json(updatedProductVariant);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get("/productVariantReverse", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productVariantPayload = req.body;
            const productVariant = await productVariantService.reserveProductVariantQuantity(productVariantPayload);
            return res.status(200).json(productVariant);
        } catch (error) {
            next(error);
            return;
        }
    });
}