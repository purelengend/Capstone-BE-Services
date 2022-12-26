import CreateProductVariantDTO from '../dto/CreateProductVariantDTO';
import { RPCTypes } from './../types/rpcType';
import { ProductVariantRepository } from './../repository/ProductVariantRepository';
import { IService } from './../service/IService';
import { ProductVariant } from './../entity/ProductVariant';
import { RPCPayload } from './../types/utilTypes';
import { ColorService } from './ColorService';
import { SizeService } from './SizeService';
import UpdateProductVariantDTO from 'src/dto/UpdateProductVariantDTO';

export class ProductVariantService implements IService {
    private productVariantRepository: ProductVariantRepository;
    private colorService: ColorService;
    private sizeService: SizeService;

    constructor() {
        this.productVariantRepository = new ProductVariantRepository();
        this.colorService = new ColorService();
        this.sizeService = new SizeService();
    }

    async getAll(): Promise<ProductVariant[]> {
        return this.productVariantRepository.getAll();
    }

    async findById(id: string): Promise<ProductVariant> {
        return this.productVariantRepository
            .findById(id);
    }

    async createProductVariant(productVariantDTO: CreateProductVariantDTO): Promise<ProductVariant> {
        const { colorId, sizeId } = productVariantDTO;
        const [color, size] = await Promise.all([
            this.colorService.findById(colorId),
            this.sizeService.findById(sizeId)
        ]);
        const productVariant = Object.assign(new ProductVariant(), productVariantDTO, { color, size });
        return this.productVariantRepository
            .createProductVariant(productVariant);
    }

    async updateProductVariant(id: string, productVariantDTO: UpdateProductVariantDTO): Promise<ProductVariant> {
        const { colorId, sizeId } = productVariantDTO;
        const [color, size] = await Promise.all([
            this.colorService.findById(colorId),
            this.sizeService.findById(sizeId)
        ]);

        const productVariant = await this.findById(id);
        Object.assign(productVariant, productVariantDTO, { color, size });
        return this.productVariantRepository
            .updateProductVariant(id, productVariant);
    }

    async deleteProductVariant(id: string): Promise<ProductVariant> {
        return this.productVariantRepository
            .deleteProductVariant(id);
    }

    async reserveProductVariantQuantity(data: any) {
        const { productVariantId, quantity } = data;
        const productVariant = await this.productVariantRepository.findById(productVariantId);
        if (!this.validateReserveProductVariantQuantity(quantity, productVariant.quantity)) {
            return {
                status: 'FAILED',
                message: 'Not enough stock'
            }
        }
        productVariant.quantity -= quantity;
        await this.productVariantRepository.save(productVariant);
        return {
            status: 'SUCCESS',
            message: 'Product variant quantity reserved'
        }
    }

    validateReserveProductVariantQuantity(revereQuantity: number, stockQuantity: number): boolean {
        return revereQuantity <= stockQuantity;
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
        const { type, data } = payload;

        switch (type) {
            case RPCTypes.RESERVE_PRODUCT_VARIANT_QUANTITY:
                return this.reserveProductVariantQuantity(data);
            default:
                throw new Error('Invalid RPC type');
        }
    }

}