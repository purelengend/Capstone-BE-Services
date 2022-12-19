import { ICategoryModel } from './../model/categoryModel';
import { CategoryRepository } from './../repository/CategoryRepository';
import { IService } from './IService';

export default class CategoryService implements IService {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    getAllCategories() {
        return this.categoryRepository.getAllCategories();
    }

    getCategoryById(id: string) {
        return this.categoryRepository.getCategoryById(id);
    }

    createCategory(category: ICategoryModel) {
        return this.categoryRepository.createCategory(category);
    }

    updateCategory(id: string, category: ICategoryModel) {
        return this.categoryRepository.updateCategory(id, category);
    }

    subscribeEvents(_: string): void {
        throw new Error("Method not implemented.");
    }
    serveRPCRequest(_: any): any {
        throw new Error("Method not implemented.");
    }
}