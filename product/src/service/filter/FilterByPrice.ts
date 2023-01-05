import { ProductQueryFilterOptions } from './../../types/product';
import { Filter } from './Filter';
export class FilterByCategories extends Filter {
    private priceRange: string;

    constructor(priceRange: string) {
        super();
        this.priceRange = priceRange;
    }

    extendFilterOptions(
        filterOptions: ProductQueryFilterOptions
    ): ProductQueryFilterOptions {
        if (this.priceRange === 'all') {
            return filterOptions;
        }
        const [min, max] = this.priceRange
            .split('-')
            .map((price) => parseInt(price));

        filterOptions.basePrice = { $gte: min, $lte: max };
        return filterOptions;
    }
}
