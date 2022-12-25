import { RPCTypes } from './../types/rpcType';
import { ProductVariantRepository } from './../repository/ProductVariantRepository';
import { IService } from './../service/IService';
import { ProductVariant } from './../entity/ProductVariant';
import { RPCPayload } from './../types/utilTypes';

export class ProductVariantService implements IService {
    private productVariantRepository: ProductVariantRepository;

    constructor(productVariantRepository: ProductVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    async findById(id: string): Promise<ProductVariant> {
        return this.productVariantRepository
            .findById(id);
    }

    async createProductVariant(productVariant: ProductVariant): Promise<ProductVariant> {
        return this.productVariantRepository
            .createProductVariant(productVariant);
    }

    async updateProductVariant(id: string, productVariant: ProductVariant): Promise<ProductVariant> {
        return this.productVariantRepository
            .updateProductVariant(id, productVariant);
    }

    async deleteProductVariant(id: string): Promise<ProductVariant> {
        return this.productVariantRepository
            .deleteProductVariant(id);
    }

    async reserveProductVariantQuantity(data: any): Promise<ProductVariant> {
        const { productVariantId, quantity } = data;
        const productVariant = await this.productVariantRepository.findById(productVariantId);
        productVariant.quantity -= quantity;
        return this.productVariantRepository.save(productVariant);
    }

    async releaseProductVariantQuantity(data: any): Promise<ProductVariant> {
        const { productVariantId, quantity } = data;
        const productVariant = await this.productVariantRepository.findById(productVariantId);
        productVariant.quantity += quantity;
        return this.productVariantRepository.save(productVariant);
    }

    subscribeEvents(_: string): void {
        throw new Error('Method not implemented.');
    }
    serveRPCRequest(payload: RPCPayload) {
        const {type, data} = payload;

        switch (type) {
            case RPCTypes.RESERVE_PRODUCT_VARIANT_QUANTITY:
                return this.reserveProductVariantQuantity(data);
            default:
                throw new Error('Invalid RPC type');
        }
    }

}