import { ProductQueryFilterOptions } from './../../types/product';
import { Filter } from './Filter';

export class FilterByCategories extends Filter {
    private categories: string[];

    constructor(categories: string[]) {
        super();
        this.categories = categories;
    }

    extendFilterOptions(
        filterOptions: ProductQueryFilterOptions
    ): ProductQueryFilterOptions {
        filterOptions.categories = { $in: this.categories };
        return filterOptions;
    }
}
