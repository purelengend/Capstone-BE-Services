import { RPCRequestProductVariantUpdateType } from '../types/orderRpcType';
import { AppDataSource } from '../data-source';
import { NotFoundError } from '../error/error-type/NotFoundError';
import { EntityNotFoundError, In, MoreThan } from 'typeorm';
import { ProductVariant } from '../entity/ProductVariant';

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
                throw new NotFoundError(
                    `ProductVariant with id ${id} not found`
                );
            }
            throw new Error(error);
        }
    }

    async createProductVariant(
        productVariant: ProductVariant
    ): Promise<ProductVariant> {
        return this.repository.save(productVariant);
    }

    async saveAll(
        productVariants: ProductVariant[]
    ): Promise<ProductVariant[]> {
        return this.repository.save(productVariants);
    }

    async updateManyProductVariantQuantity(
        productVariants: ProductVariant[]
    ): Promise<ProductVariant[]> {
        return this.updateManyTransaction(
            productVariants,
            (updateProductVariant, productVariantToUpdate) => {
                productVariantToUpdate.quantity = updateProductVariant.quantity;
            }
        );
    }

    async updateManyProductVariantSellingPrice(
        productVariants: ProductVariant[]
    ): Promise<ProductVariant[]> {
        return this.updateManyTransaction(
            productVariants,
            (updateProductVariant, productVariantToUpdate) => {
                productVariantToUpdate.sellingPrice =
                    updateProductVariant.sellingPrice;
            }
        );
    }

    async updateManyTransaction(
        productVariants: ProductVariant[],
        updatePropertyCallback: (
            updateProductVariant: ProductVariant,
            productVariantToUpdate: ProductVariant
        ) => void
    ): Promise<ProductVariant[]> {
        try {
            return AppDataSource.transaction(
                async (transactionalEntityManager) => {
                    const promises = productVariants.map(
                        async (productVariant) => {
                            const productVariantToUpdate = await this.findById(
                                productVariant.id
                            );
                            updatePropertyCallback(
                                productVariant,
                                productVariantToUpdate
                            );
                            return transactionalEntityManager.save(
                                productVariantToUpdate
                            );
                        }
                    );
                    return Promise.all(promises);
                }
            );
        } catch (error) {
            console.log(
                'Error when update many product variant quantity: ',
                error
            );
            throw new Error(error);
        }
    }

    async save(productVariant: ProductVariant): Promise<ProductVariant> {
        return this.repository.save(productVariant);
    }

    async updateProductVariant(
        id: string,
        productVariant: ProductVariant
    ): Promise<ProductVariant> {
        try {
            let productVariantToUpdate = await this.findById(id);
            productVariantToUpdate = {
                ...productVariantToUpdate,
                ...productVariant,
            };
            return this.repository.save(productVariantToUpdate);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(
                    `ProductVariant with id ${id} not found`
                );
            }
            throw new Error(error);
        }
    }

    async deleteProductVariant(id: string): Promise<ProductVariant> {
        try {
            const productVariant = await this.repository.findOneOrFail({
                where: { id },
            });
            return this.repository.remove(productVariant);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(
                    `ProductVariant with id ${id} not found`
                );
            }
            throw new Error(error);
        }
    }

    async findByProductIdColorAndSize(
        productId: string,
        colorName: string,
        sizeName: string
    ): Promise<ProductVariant | null> {
        return this.repository.findOne({
            relations: {
                color: true,
                size: true,
            },
            where: {
                productId,
                color: {
                    name: colorName,
                },
                size: {
                    name: sizeName,
                },
            },
        });
    }

    // Find a list of product variants by a list that each item contains a productId and a color and a size
    async findByListProductIdAndColorAndSize(
        productIdColorSizeList: RPCRequestProductVariantUpdateType[]
    ): Promise<ProductVariant[]> {
        try {
            const productVariantListQuery = this.repository
                .createQueryBuilder('productVariant')
                .select([
                    'productVariant.id',
                    'productVariant.productId',
                    'color.name',
                    'size.name',
                    'productVariant.quantity',
                    'productVariant.sellingPrice',
                ])
                .leftJoin('productVariant.color', 'color')
                .leftJoin('productVariant.size', 'size')
                .where('productVariant.productId = :productId', {
                    productId: productIdColorSizeList[0].productId,
                })
                .andWhere('color.name = :colorName', {
                    colorName: productIdColorSizeList[0].color,
                })
                .andWhere('size.name = :sizeName', {
                    sizeName: productIdColorSizeList[0].size,
                });

            for (let i = 1; i < productIdColorSizeList.length; i++) {
                productVariantListQuery.orWhere(
                    `(productVariant.productId = :productId${i} AND color.name = :colorName${i} AND size.name = :sizeName${i})`,
                    {
                        [`productId${i}`]: productIdColorSizeList[i].productId,
                        [`colorName${i}`]: productIdColorSizeList[i].color,
                        [`sizeName${i}`]: productIdColorSizeList[i].size,
                    }
                );
            }
            return productVariantListQuery.getMany();
        } catch (error) {
            throw new Error(error);
        }
    }

    async findInStockByProductIdListAndColorListAndSizeList(
        productIdList: string[],
        colorList: string[],
        sizeList: string[]
    ) {
        const colorQueryCondition = {
            color: {
                name: In(colorList),
            },
        };
        const sizeQueryCondition = {
            size: {
                name: In(sizeList),
            },
        };
        return this.repository.find({
            select: {
                productId: true,
            },
            relations: {
                color: true,
                size: true,
            },
            where: {
                productId: In(productIdList),
                quantity: MoreThan(0),
                ...(colorList.length > 0 ? colorQueryCondition : {}),
                ...(sizeList.length > 0 ? sizeQueryCondition : {}),
            },
        });
    }

    async findByProductIdList(
        productIdList: string[]
    ): Promise<ProductVariant[]> {
        return this.repository.find({
            where: {
                productId: In(productIdList),
            },
        });
    }
}
