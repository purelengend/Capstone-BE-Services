import { Application, Request, Response } from 'express';

export default (app: Application) => {

    app.get('/', (_: Request, res: Response) => {
        return res.json({ message: 'Hello World from product service' });
    });
};