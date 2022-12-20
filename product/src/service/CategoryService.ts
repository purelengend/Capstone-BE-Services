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
        return this.categoryRepository.getCategoryByIdWithProduct(id);
    }

    createCategory(category: ICategoryModel) {
        return this.categoryRepository.createCategory(category);
    }

    updateCategory(id: string, category: ICategoryModel) {
        return this.categoryRepository.updateCategory(id, category);
    }

    async addProductToCategory(categoryId: string, productId: string) {
        const isDuplicate = await this.validateDuplicateProduct(categoryId, productId);
        if (isDuplicate) {
            throw new Error('Product already exists in the category');
        }   
        return this.categoryRepository.addProductToCategory(categoryId, productId);
    }

    async validateDuplicateProduct(categoryId: string, productId: string): Promise<boolean> {
        const category = await this.categoryRepository.getCategoryByIdWithProduct(categoryId);
        const isDuplicate = category.products.some((product) => product.id === productId);
        return isDuplicate;
    }

    addProductToCategories(productId: string, categoryIds: string[] = []) {
        return this.categoryRepository.addProductToMultipleCategories(categoryIds, productId);
    }

    removeProductFromCategories(categoryId: string[], productId: string) {
        return this.categoryRepository.removeProductFromMultipleCategories(categoryId, productId);
    }

    subscribeEvents(_: string): void {
        throw new Error("Method not implemented.");
    }
    serveRPCRequest(_: any): any {
        throw new Error("Method not implemented.");
    }
}