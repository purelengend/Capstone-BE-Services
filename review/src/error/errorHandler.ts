import { Application, Request, Response } from 'express';

const errorHandler = (app: Application) => {
    app.use((err: Error, _: Request, res: Response) => {
        console.error(err);
        const statusCode = res.statusCode || 500;
        const errorInfo = err.message;
        res.status(statusCode).json(errorInfo);
    });
}

export default errorHandler;