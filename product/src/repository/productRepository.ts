import { NotFoundError } from './../error/error-type/NotFoundError';
import ProductModel, { IProductModel } from '../model/productModel';

export class ProductRepository {
    async getProductById(id: string): Promise<IProductModel | null> {
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new NotFoundError('Product id did not match');
        }
        return product;
    }

    async getProducts(): Promise<IProductModel[]> {
        const products = await ProductModel.find();
        return products;
    }

    async createProduct(product: IProductModel): Promise<IProductModel> {
        product = await new ProductModel(product).save();
        if (!product) {
            throw new Error('Product save failed in the database');
        }
        return product;
    }

    async updateProduct(id: string, product: IProductModel): Promise<IProductModel | null> {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, {
            new: true,
        });
        if (!updatedProduct) {
            throw new Error('Product update failed in the database');
        }
        return updatedProduct;

    }

    async deleteProduct(id: string): Promise<IProductModel | null> {
        const deleteProduct = await ProductModel.findByIdAndDelete(id);
        if (!deleteProduct) {
            throw new Error('Product delete failed in the database');
        }
        return deleteProduct;
    }
}
