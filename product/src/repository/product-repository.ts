import ProductModel, { IProduct } from "../model/product";

export class ProductRepository {

    async getById(id: string) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.log('Error in getById', error);
            throw error;
        }
    }


    async createNewProduct(product: IProduct) {
        try {
            return await new ProductModel(product).save(); 
        } catch (error) {
            console.log('Error in create', error);
            throw error;
        }
    }

    async updateProduct(id: string, product: IProduct) {
        try {
            return await ProductModel.findByIdAndUpdate(id, product, { new: true });
        } catch (error) {
            console.log('Error in update', error);
            throw new Error("Error in update");
        }
    }

    async deleteProduct(id: string) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            console.log('Error in delete', error);
            throw new Error("Error in delete");
        }
    }
}