import { VariantFilterOptions } from './../../types/product';
import { Filter } from './Filter';

export class FilterByColor extends Filter {
    private colorList: string[];

    constructor(colorList: string[]) {
        super();
        this.colorList = colorList;
    }
    extendFilterOptions(
        filterOptions: VariantFilterOptions
    ): VariantFilterOptions {
        filterOptions.colorList = this.colorList;
        return filterOptions;
    }
}
