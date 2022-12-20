import { CategoryWithProduct } from './../types/category';
import { IProductModel } from './../model/productModel';
import CategoryModel, { ICategoryModel } from './../model/categoryModel';

export class CategoryRepository {
    async getCategoryById(id: string): Promise<ICategoryModel | null> {
        const category = await CategoryModel
            .findById(id)
        return category;
    }

    async getCategoryByIdWithProduct(categoryId: string): Promise<CategoryWithProduct> {
        const category = await CategoryModel
            .findById(categoryId)
            .populate<{products: IProductModel[]}>('products', ['-categories','-photoUrls']).orFail();
        return category;
    }

    async getAllCategories(): Promise<ICategoryModel[]> {
        const categories = await CategoryModel.find();
        return categories;
    }

    async createCategory(category: ICategoryModel): Promise<ICategoryModel> {
        category = await new CategoryModel(category).save();
        if (!category) {
            throw new Error('Category save failed in the database');
        }
        return category;
    }

    async updateCategory(id: string, category: ICategoryModel): Promise<ICategoryModel | null> {
        const updatedCategory = await CategoryModel.findByIdAndUpdate
            (id, category, { new: true });
        if (!updatedCategory) {
            throw new Error('Category update failed in the database');
        }
        return updatedCategory;
    }

    async deleteCategory(id: string): Promise<ICategoryModel | null> {
        const deleteCategory = await CategoryModel.findByIdAndDelete(id);
        if (!deleteCategory) {
            throw new Error('Category delete failed in the database');
        }
        return deleteCategory;
    }

    async addProductToMultipleCategories(categoryIds: string[], productId: string): Promise<void> {
        // const categories = await Promise.all(categoryIds.map(async (categoryId) => {
        //     const category = await this.addProductToCategory(categoryId, productId);
        //     return category;
        // }));
        // return categories;
        await CategoryModel.updateMany({ '_id': categoryIds }, { $addToSet: { products: productId } });
    }

    async removeProductFromMultipleCategories(categoryIds: string[], productId: string): Promise<void> {
        await CategoryModel.updateMany({ '_id': categoryIds }, { $pull: { products: productId } });
    }

    async addProductToCategory(categoryId: string, productId: string): Promise<ICategoryModel> {
        const category = await CategoryModel.findById(categoryId).orFail();

        category.products = category.products ? category.products : [];
        category.products.push(productId);
        const updatedCategory = await category.save();
        if (!updatedCategory) {
            throw new Error('Category update failed in the database');
        }
        return updatedCategory;
    }
}