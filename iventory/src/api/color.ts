import { ColorService } from './../service/ColorService';
import { Application, Request, Response, NextFunction } from 'express';

export default (app: Application): void => {
    const colorService = new ColorService();

    app.get(
        '/color/all',
        async (_: Request, res: Response, next: NextFunction) => {
            try {
                const sizes = await colorService.getAll();
                return res.status(200).json(sizes);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.get(
        '/color/:name',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const size = await colorService.findByName(req.params.name);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.post(
        '/color',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const size = await colorService.createColor(req.body.name);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.put(
        '/color/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = parseInt(req.params.id);
                const size = await colorService.updateColor(id, req.body.name);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );

    app.delete(
        '/color/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = parseInt(req.params.id);
                const size = await colorService.deleteColor(id);
                return res.status(200).json(size);
            } catch (error) {
                next(error);
                return;
            }
        }
    );
};
