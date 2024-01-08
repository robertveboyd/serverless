import Dynamo from "../common/dynamo/dynamo";
import ErrorMessage from "../common/errors/ErrorMessage";
import { CartItems, CartItemsSchema } from "../models/cartItem";

const getCart = async (customerId: string): Promise<CartItems> => {
  const pk = { attribute: process.env.CART_PARTITION_KEY, value: customerId };
  const cart = await Dynamo.getMany(process.env.CART_TABLE!, pk);
  if (!cart) {
    throw new Error(ErrorMessage.DATA_NOT_FOUND);
  }
  const parsedCart = CartItemsSchema.safeParse(cart);
  if (!parsedCart.success) {
    throw new Error(ErrorMessage.INVALID_MODEL_PARAMS);
  }

  return parsedCart.data;
};

export default getCart;
