import productModel, { IProductModel } from "./../../model/productModel";
import { Filter } from "./Filter";
import { FilterByVariantOPtions } from "./FilterByVariantOptions";

export class ProductRetrieveMediator {

    async retrieveProducts(filters: Filter[], page = 1, limit = 10) : Promise<IProductModel[] | null> {
        // let query = productModel.find();
        let filterOptions = {};

        for (const filter of filters) {
            if (!(filter instanceof FilterByVariantOPtions)) {
                filterOptions = filter.filter(filterOptions);
            }
        }

        let productModelList = await productModel.find(filterOptions);
        let filteredProductModelList: IProductModel[] | null = null;
        for (const filter of filters) {
            if (filter instanceof FilterByVariantOPtions) {
                filteredProductModelList = await filter.filterRPC(productModelList);
            }
        }
        return filteredProductModelList;
    }
}