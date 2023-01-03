import { ItemDTO } from "./ItemDTO";

export class CartDTO {
    userId: string;
    itemList: ItemDTO[];
}