import { ICategoryModel } from './../model/categoryModel';
import { Application, NextFunction, Request, Response } from 'express';
import CategoryService from '../service/categoryService';

export default (app: Application) => {
    const categoryService = new CategoryService();
    
    app.get('/category/all', async (_: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await categoryService.getAllCategories();
            return res.status(200).json(categories);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/category/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            return res.status(200).json(category);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/category/create', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = req.body as ICategoryModel;
            const data = await categoryService.createCategory(category);
            return res.status(200).json(data);
        } catch (error) {
            next(error)
            return;
        }
    });

    app.put('/category/update/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const category = req.body as ICategoryModel;
            const data = await categoryService.updateCategory(id, category);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
            return;
        }
    });
}