import { IService } from './IService';
import { RPCTypes } from '../types/rpcType';
import { EventPayload, RPCPayload } from '../types/utilType';
import { IProductModel } from "../model/productModel";
import { ProductRepository } from "../repository/ProductRepository";
import EventType from '../types/eventType';

export default class ProductService implements IService {
    private productRepository: ProductRepository;
    
    constructor() {
        this.productRepository = new ProductRepository();
    }
    
    async getProducts() {
        return await this.productRepository.getProducts();
    }
    
    async getProductById(id: string) {
        return await this.productRepository.getProductById(id);
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

    subscribeEvents(payload: string): void {
        const eventPayload: EventPayload = JSON.parse(payload);
        
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