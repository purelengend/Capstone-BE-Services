import { IProductModel } from "src/model/productModel";
import { ProductRepository } from "../repository/productRepository";

export default class ProductService {
    private productRepository: ProductRepository;
    
    constructor() {
        this.productRepository = new ProductRepository();
    }
    
    async getProducts() {
        return await this.productRepository.getProducts();
    }
    
    async getProduct(id: string) {
        return await this.productRepository.getProduct(id);
    }
    
    async createProduct(product: IProductModel) {
        return await this.productRepository.createProduct(product);
    }
    
    async updateProduct(id: string, product: any) {
        return await this.productRepository.updateProduct(id, product);
    }
    
    async deleteProduct(id: string) {
        return await this.productRepository.deleteProduct(id);
    }
}