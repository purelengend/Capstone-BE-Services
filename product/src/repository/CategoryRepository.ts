import { NotFoundError } from './../error/error-type/NotFoundError';
import { CategoryWithProduct } from './../types/category';
import { IProductModel } from './../model/productModel';
import CategoryModel, { ICategoryModel } from './../model/categoryModel';

export class CategoryRepository {
    async getCategoryById(id: string): Promise<ICategoryModel | null> {
        const category = await CategoryModel.findById(id).orFail();
        return category;
    }

    async getCategoryByIdWithProduct(
        categoryId: string
    ): Promise<CategoryWithProduct> {
        try {
            const category = await CategoryModel.findById(categoryId)
                .populate<{ products: IProductModel[] }>('products', [
                    '-categories',
                    '-photoUrls',
                ])
                .orFail();
            return category;
        } catch (error) {
            throw new NotFoundError(`Category with ${categoryId} not found`);
        }
    }

    async getAllCategories(): Promise<ICategoryModel[]> {
        try {
            const categories = await CategoryModel.find();
            return categories;
        } catch (error) {
            throw new NotFoundError('Category not found');
        }
    }

    async createCategory(category: ICategoryModel): Promise<ICategoryModel> {
        try {
            category = await new CategoryModel(category).save();
            return category;
        } catch (error) {
            throw new Error('Category creation failed in the database');
        }
    }

    async updateCategory(
        id: string,
        category: ICategoryModel
    ): Promise<ICategoryModel | null> {
        try {
            const updatedCategory = await CategoryModel.findByIdAndUpdate(
                id,
                category,
                { new: true }
            );
            return updatedCategory;
        } catch (error) {
            throw new Error('Category update failed in the database');
        }
    }

    async deleteCategory(id: string): Promise<ICategoryModel | null> {
        const deleteCategory = await CategoryModel.findByIdAndDelete(id);
        if (!deleteCategory) {
            throw new Error('Category delete failed in the database');
        }
        return deleteCategory;
    }

    async addProductToMultipleCategories(
        categoryIds: string[],
        productId: string
    ): Promise<void> {
        // const categories = await Promise.all(categoryIds.map(async (categoryId) => {
        //     const category = await this.addProductToCategory(categoryId, productId);
        //     return category;
        // }));
        // return categories;
        try {
            await CategoryModel.updateMany(
                { _id: categoryIds },
                { $addToSet: { products: productId } }
            );
        } catch (error) {
            throw new Error('Category update failed in the database');
        }
    }

    async removeProductFromMultipleCategories(
        removedCategoryIds: string[],
        productId: string
    ): Promise<void> {
        try {
            await CategoryModel.updateMany(
                { _id: removedCategoryIds },
                { $pull: { products: productId } }
            );
        } catch (error) {
            throw new Error('Category update failed in the database');
        }
    }

    async addProductToCategory(
        categoryId: string,
        productId: string
    ): Promise<ICategoryModel> {
        try {
            const category = await CategoryModel.findById(categoryId).orFail();
            category.products = category.products ? category.products : [];
            category.products.push(productId);
            const updatedCategory = await category.save();
            return updatedCategory;
        } catch (error) {
            throw new Error('Category update failed in the database');
        }
    }
}
