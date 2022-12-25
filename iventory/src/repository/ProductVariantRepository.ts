import { NotFoundError } from './../error/error-type/NotFoundError';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ProductVariant } from './../entity/ProductVariant';

export class ProductVariantRepository extends Repository<ProductVariant> {
    async findById(id: string): Promise<ProductVariant> {
        try {
            return this.findOneOrFail({
                where: { id },
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`ProductVariant with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async createProductVariant(productVariant: ProductVariant): Promise<ProductVariant> {
        return this.save(productVariant);
    }

    async updateProductVariant(id: string, productVariant: ProductVariant): Promise<ProductVariant> {
        try {
            const productVariantToUpdate = await this.findOneOrFail({where: {id}});
            productVariantToUpdate.color = productVariant.color;
            productVariantToUpdate.size = productVariant.size;
            return this.save(productVariantToUpdate);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`ProductVariant with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async deleteProductVariant(id: string): Promise<ProductVariant> {
        try {
            const productVariant = await this.findOneOrFail({where: {id}});
            return this.remove(productVariant);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`ProductVariant with id ${id} not found`);
            }
            throw new Error(error);
        }
    }
} 