import cartModel, { ICartModel } from "./../model/cartModel";

export class CartRepository {
    async getAllCarts(): Promise<ICartModel[]> {
        const carts = await cartModel.find();
        return carts;
    }

    async getCartByUserId(userId: string): Promise<ICartModel | null> {
        const cart = await cartModel.findOne({ userId });
        return cart;
    }

    async createCart(cart: ICartModel): Promise<ICartModel> {
        cart = await new cartModel(cart).save();
        return cart;
    }

    async updateCart(userId: string, cart: ICartModel): Promise<ICartModel | null> {
        const updatedCart = await cartModel.findOneAndUpdate(
            { userId },
            cart,
            {
                new: true,
            }
        );
        return updatedCart;
    }
}