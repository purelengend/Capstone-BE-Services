import { SizeService } from '../service/SizeService';
import { Application, Request, Response, NextFunction } from 'express';

export default (app: Application): void => {
    const sizeService = new SizeService();

    app.get(
        '/size/all',
        async (_: Request, res: Response, next: NextFunction) => {
            try {
                const sizes = await sizeService.getAll();
                return res.status(200).json(sizes);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.get(
        '/size/:name',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const size = await sizeService.findByName(req.params.name);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.post(
        '/size',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const size = await sizeService.createSize(req.body.name);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.put(
        '/size/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = parseInt(req.params.id);
                const size = await sizeService.updateSize(id, req.body.name);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.delete(
        '/size/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = parseInt(req.params.id);
                const size = await sizeService.deleteSize(id);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );
};
