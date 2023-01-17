import { IProductModel } from './../../model/productModel';
import { ProductRepository } from '../../repository/ProductRepository';
import {
    ProductQueryFilterOptions,
    ProductRetrieveResponseType,
    SortFieldProduct,
} from './../../types/product';
import { Filter } from './Filter';
import { FilterByVariantOptions } from './FilterByVariantOptions';

export class ProductRetrieveMediator {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async retrieveProducts(
        filters: Filter[],
        page = 1,
        pageSize = 10,
        orderBy?: SortFieldProduct,
        sortBy?: 'asc' | 'desc'
    ): Promise<ProductRetrieveResponseType> {
        let filterByVariantOptions = this.findFilterVariantOptions(filters);
        if (filterByVariantOptions) {
            filters = this.removeFilterVariantOptions(filters);
        }

        let filterOptions: ProductQueryFilterOptions = {};
        filters.forEach((filter) => {
            filterOptions = filter.extendFilterOptions(filterOptions);
        });

        let productModelList =
            await this.productRepository.getProductsByFilterOptions(
                filterOptions
            );

        if (!this.validatePageParameters(page, pageSize)) {
            page = 1;
            pageSize = 4;
        }
        let total = productModelList.length;
        page = page > Math.ceil(total / pageSize) ? 1 : page;
        // sort product list by basePrice or rating
        if (orderBy && sortBy) {
            productModelList = this.sortProductModelList(
                productModelList,
                orderBy as SortFieldProduct,
                sortBy
            );
        }
        if (!filterByVariantOptions) {
            productModelList = productModelList.slice(
                (page - 1) * pageSize,
                pageSize * pageSize
            );
            return {
                productList: productModelList,
                page,
                total,
            };
        }

        return await filterByVariantOptions.retrieveVariantRPC(
            productModelList,
            page,
            pageSize
        );
    }

    findFilterVariantOptions(filters: Filter[]): FilterByVariantOptions | null {
        for (const filter of filters) {
            if (filter instanceof FilterByVariantOptions) {
                return filter;
            }
        }
        return null;
    }

    removeFilterVariantOptions(filters: Filter[]): Filter[] {
        const newFilters: Filter[] = [];
        for (const filter of filters) {
            if (!(filter instanceof FilterByVariantOptions)) {
                newFilters.push(filter);
            }
        }
        return newFilters;
    }

    validatePageParameters(page: number, pageSize: number): boolean {
        if (page < 1 || pageSize < 1) {
            return false;
        }
        return true;
    }

    sortProductModelList(
        productModelList: IProductModel[],
        orderBy?: SortFieldProduct,
        sortBy?: 'asc' | 'desc'
    ) {
        if (!orderBy || !sortBy) {
            return productModelList;
        }
        if (sortBy === 'asc') {
            productModelList.sort((a, b) => {
                if (a[orderBy]! > b[orderBy]!) {
                    return 1;
                }
                if (a[orderBy]! < b[orderBy]!) {
                    return -1;
                }
                return 0;
            });
        } else {
            productModelList.sort((a, b) => {
                if (a[orderBy]! > b[orderBy]!) {
                    return -1;
                }
                if (a[orderBy]! < b[orderBy]!) {
                    return 1;
                }
                return 0;
            });
        }
        return productModelList;
    }
}
