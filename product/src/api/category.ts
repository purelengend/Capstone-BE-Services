import { ICategoryModel } from './../model/categoryModel';
import { Application, NextFunction, Request, Response } from 'express';
import CategoryService from '../service/categoryService';

export default (app: Application) => {
    const categoryService = new CategoryService();
    
    app.get('/all', (_: Request, res: Response, next: NextFunction) => {
        try {
            const categories = categoryService.getAllCategories();
            return res.status(200).json(categories);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/:id', (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = categoryService.getCategoryById(req.params.id);
            return res.status(200).json(category);
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/create', (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = req.body as ICategoryModel;
            const data = categoryService.createCategory(category);
            return res.status(200).json(data);
        } catch (error) {
            next(error)
            return;
        }
    });

    app.put('/update/:id', (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const category = req.body as ICategoryModel;
            const data = categoryService.updateCategory(id, category);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
            return;
        }
    });
}