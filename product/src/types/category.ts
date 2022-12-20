import { IProductModel } from './../model/productModel';
import { ICategoryModel } from './../model/categoryModel';

export type CategoryWithProduct = Omit<ICategoryModel, 'products'> & {products: IProductModel[]}
