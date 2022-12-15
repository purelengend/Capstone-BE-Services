import { ValidationError } from './../error/error-type/ValidationError';
import { NotFoundError } from './../error/error-type/NotFoundError';
import { IService } from './IService';
import { RPCTypes } from '../types/rpcType';
import { RPCPayload } from '../types/utilType';
import { IProductModel } from "../model/productModel";
import { ProductRepository } from "../repository/ProductRepository";


export default class ProductService implements IService {
    private productRepository: ProductRepository;
    
    constructor() {
        this.productRepository = new ProductRepository();
    }
    
    async getProducts() {
        return await this.productRepository.getProducts();
    }
    
    async getProductById(id: string) {
        const product = await this.productRepository.getProductById(id);
        if (!product) {
            throw new NotFoundError('Product id did not match');
        }
        return product;
    }
    
    async createProduct(product: IProductModel) {
        product = await this.productRepository.createProduct(product);
        if (!product) {
            throw new ValidationError('product create body did not match');
        }
        return product;
    }
    
    async updateProduct(id: string, product: any) {
        return await this.productRepository.updateProduct(id, product);
    }
    
    async deleteProduct(id: string) {
        const product = await this.productRepository.getProductById(id);
        if (!product) {
            throw new NotFoundError('Product id did not match');
        }
        return await this.productRepository.deleteProduct(id);
    }

    subscribeEvents(_: string): void {        
        throw new Error("Method not implemented.");
    }

    serveRPCRequest(payload: RPCPayload) {
        const { type, data } = payload;
        switch (type) {
            case RPCTypes.GET_PRODUCT_BY_ID:
                return this.getProductById(data?.id as string);
            default:
                return null;
        }
    }
}