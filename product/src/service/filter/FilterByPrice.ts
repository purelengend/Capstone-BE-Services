import { Model, Document } from 'mongoose';
import { Filter } from './Filter';
export class FilterByCategories extends Filter {
    private priceRange: string;

    constructor(priceRange: string) {
        super();
        this.priceRange = priceRange;
    }

    filter (filterOptions: Object) {
        const [min, max] = this.priceRange.split('-').map((price) => parseInt(price));
        return Object.assign(filterOptions, { basePrice: { $gte: min, $lte: max } })
    }
}