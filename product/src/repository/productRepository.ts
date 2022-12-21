// import { BaseError } from './../error/error-type/BaseError';
import { NotFoundError } from './../error/error-type/NotFoundError';
import ProductModel, { IProductModel } from '../model/productModel';

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

    async updateProduct(id: string, product: IProductModel): Promise<IProductModel | null> {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, {
                new: true,
            });
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
}
