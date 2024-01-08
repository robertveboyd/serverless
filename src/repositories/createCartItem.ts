import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import Dynamo from "../common/dynamo/dynamo";
import ErrorMessage from "../common/errors/ErrorMessage";
import { CartItem, CartItemSchema } from "../models/cartItem";

const createCartItem = async (cartItem: CartItem): Promise<CartItem> => {
  try {
    const parsedCartItem = CartItemSchema.safeParse(cartItem);
    if (!parsedCartItem.success) {
      throw new Error(ErrorMessage.INVALID_MODEL_PARAMS);
    }
    await Dynamo.create(
      process.env.CART_TABLE!,
      parsedCartItem.data,
      process.env.CART_PARTITION_KEY,
      process.env.CART_SORT_KEY
    );
    return parsedCartItem.data;
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException)
      throw new Error(ErrorMessage.ITEM_ALREADY_EXISTS);
    throw error;
  }
};

export default createCartItem;
