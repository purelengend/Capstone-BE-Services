// @ts-nocheck
import { Application, NextFunction, Request, Response } from 'express';

const errorHandler = (app: Application) => {
    console.log('error handler called');
    
    app.use((err: BaseError, _: Request, res: Response, next: NextFunction) => {
        const statusCode = err.statusCode || 500;
        const errorInfo = {code: statusCode, name: err.name, message: err.message};
        return res.status(statusCode).json(errorInfo);
    });
}

export default errorHandler;