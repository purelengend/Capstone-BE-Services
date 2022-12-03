import ProductModel, { IProductModel } from '../model/productModel';

export class ProductRepository {
    async getProduct(id: string) : Promise<IProductModel | null> {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.log('Error in getProduct', error);
            throw error;
        }
    }

    async getProducts(): Promise<IProductModel[]> {
        try {
            return await ProductModel.find();
        } catch (error) {
            console.log('Error in getProducts', error);
            throw error;
        }
    }

    async createProduct(product: IProductModel) : Promise<IProductModel> {
        try {
            return await new ProductModel(product).save();
        } catch (error) {
            console.log('Error in create', error);
            throw error;
        }
    }

    async updateProduct(id: string, product: IProductModel) : Promise<IProductModel | null> {
        try {
            return await ProductModel.findByIdAndUpdate(id, product, {
                new: true,
            });
        } catch (error) {
            console.log('Error in update', error);
            throw new Error('Error in update');
        }
    }

    async deleteProduct(id: string) : Promise<IProductModel | null> {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            console.log('Error in delete', error);
            throw new Error('Error in delete');
        }
    }
}
