import { Filter } from './Filter';

export class FilterByCategories extends Filter {
    private categories: string[];

    constructor(categories: string[]) {
        super();
        this.categories = categories;
    }

    filter (filterOptions: Object) {
        return Object.assign(filterOptions, { categories: {$in: this.categories} })
    }
}