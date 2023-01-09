import { VariantFilterOptions } from './../../types/product';
import { Filter } from './Filter';

export class FilterBySize extends Filter {
    private sizeList: string[];

    constructor(sizeList: string[]) {
        super();
        this.sizeList = sizeList;
    }

    extendFilterOptions(
        filterOptions: VariantFilterOptions
    ): VariantFilterOptions {
        filterOptions.sizeList = this.sizeList;
        return filterOptions;
    }
}
