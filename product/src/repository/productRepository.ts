import { ProductQueryFilterOptions } from '../types/product';
// import { BaseError } from './../error/error-type/BaseError';
import { NotFoundError } from '../error/error-type/NotFoundError';
import ProductModel, { IProductModel } from '../model/productModel';
import CategoryModel from '../model/categoryModel';

export class ProductRepository {
    async getProductById(id: string): Promise<IProductModel | null> {
        try {
            const product = await ProductModel.findById(id);
            return product;
        } catch (error) {
            throw new NotFoundError(`Product with ${id} not found`);
        }
    }

    async getProducts(): Promise<IProductModel[]> {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            throw new NotFoundError('Product not found');
        }
    }

    async createProduct(product: IProductModel): Promise<IProductModel> {
        try {
            product = await new ProductModel(product).save();
            return product;
        } catch (error) {
            throw new Error('Product creation failed in the database');
        }
    }

    async updateProduct(
        id: string,
        product: IProductModel
    ): Promise<IProductModel | null> {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                id,
                product,
                {
                    new: true,
                }
            );
            return updatedProduct;
        } catch (error) {
            throw new Error('Product update failed in the database');
        }
    }

    async deleteProduct(id: string): Promise<IProductModel | null> {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            return deleteProduct;
        } catch (error) {
            throw new Error('Product delete failed in the database');
        }
    }

    async getProductsByCategory(category: string): Promise<IProductModel[]> {
        try {
            const products = await ProductModel.find({ category });
            return products;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getProductsByCategories(
        categories: string[]
    ): Promise<IProductModel[]> {
        try {
            const products = await ProductModel.find({
                category: { $in: categories },
            });
            return products;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getProductsByIdList(idList: string[]): Promise<IProductModel[]> {
        try {
            const products = await ProductModel.find({ _id: { $in: idList } });
            return products;
        } catch (error) {
            throw new Error(error);
        }
    }

    async paginateProducts(
        page: number,
        pageSize: number,
        orderBy?: string,
        sortBy?: 'asc' | 'desc'
    ): Promise<IProductModel[]> {
        try {
            if (orderBy === 'price' && sortBy) {
                const products = await ProductModel.find()
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .sort({ basePrice: sortBy });
                return products;
            }
            if (orderBy === 'rating' && sortBy) {
                const products = await ProductModel.find()
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .sort({ rating: sortBy });
                return products;
            }
            const products = await ProductModel.find()
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            return products;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getProductsByFilterOptions(
        filterOptions: ProductQueryFilterOptions
    ): Promise<IProductModel[]> {
        try {
            const { categories, basePrice } = filterOptions;

            if (categories && basePrice) {
                return await CategoryModel.find({
                    name: { $in: categories },
                }).then((categories) => {
                    const categoryIds = categories.map(
                        (category) => category._id
                    );
                    return ProductModel.find({
                        basePrice: { $gte: basePrice.min, $lte: basePrice.max },
                        categories: { $all: categoryIds },
                    });
                });
            } else if (categories) {
                return await CategoryModel.find({
                    name: { $in: categories },
                }).then((categories) => {
                    const categoryIds = categories.map(
                        (category) => category._id
                    );
                    return ProductModel.find({
                        categories: { $all: categoryIds },
                    });
                });
            } else if (basePrice) {
                return await ProductModel.find({
                    basePrice: { $gte: basePrice.min, $lte: basePrice.max }
                });
            } else {
                return await ProductModel.find();
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}
