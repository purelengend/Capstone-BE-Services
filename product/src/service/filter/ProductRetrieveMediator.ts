import { ProductRepository } from './../../repository/productRepository';
import {
    ProductQueryFilterOptions,
    ProductRetrieveResponseType,
} from './../../types/product';
import { Filter } from './Filter';
import { FilterByVariantOptions } from './FilterByVariantOptions';

export class ProductRetrieveMediator {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async retrieveProducts(
        filters: Filter[],
        page = 1,
        pageSize = 10
    ): Promise<ProductRetrieveResponseType> {

        let filterByVariantOptions = this.findFilterByVariantOptions(filters);
        if (filterByVariantOptions) {
            filters = this.removeFilterByVariantOptions(filters);
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
        page = page > total / pageSize ? Math.ceil(total / pageSize) : page;

        if (!filterByVariantOptions) {
            productModelList = productModelList.splice(
                (page - 1) * pageSize,
                pageSize
            );
            return {
                productList: productModelList,
                page,
                total,
            };
        }

        return await filterByVariantOptions.filterRPC(productModelList, page, pageSize);
    }

    findFilterByVariantOptions(
        filters: Filter[]
    ): FilterByVariantOptions | null {
        for (const filter of filters) {
            if (filter instanceof FilterByVariantOptions) {
                return filter;
            }
        }
        return null;
    }

    removeFilterByVariantOptions(filters: Filter[]): Filter[] {
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
}
