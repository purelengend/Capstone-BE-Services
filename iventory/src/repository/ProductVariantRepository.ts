import { AppDataSource } from './../data-source';
import { NotFoundError } from './../error/error-type/NotFoundError';
import { EntityNotFoundError } from 'typeorm';
import { ProductVariant } from './../entity/ProductVariant';

export class ProductVariantRepository {

    private repository = AppDataSource.getRepository(ProductVariant);

    async getAll(): Promise<ProductVariant[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<ProductVariant> {
        try {
            return this.repository.findOneOrFail({
                where: { id },
                relations: {
                    color: true,
                    size: true,
                },
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`ProductVariant with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async createProductVariant(productVariant: ProductVariant): Promise<ProductVariant> {
        return this.repository.save(productVariant);
    }

    async save(productVariant: ProductVariant): Promise<ProductVariant> {
        return this.repository.save(productVariant);
    }

    async updateProductVariant(id: string, productVariant: ProductVariant): Promise<ProductVariant> {
        try {
            let productVariantToUpdate = await this.findById(id);
            productVariantToUpdate = {
                ...productVariant,
            }
            return this.repository.save(productVariantToUpdate);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`ProductVariant with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async deleteProductVariant(id: string): Promise<ProductVariant> {
        try {
            const productVariant = await this.repository.findOneOrFail({where: {id}});
            return this.repository.remove(productVariant);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`ProductVariant with id ${id} not found`);
            }
            throw new Error(error);
        }
    }
} 