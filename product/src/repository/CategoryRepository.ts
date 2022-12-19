import CategoryModel, { ICategoryModel } from './../model/categoryModel';

export class CategoryRepository {
    async getCategoryById(id: string): Promise<ICategoryModel | null> {
        const category = await CategoryModel
            .findById(id)
            .populate('products');
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
}