import { CartItems } from "../models/cartItem";
import getCartFromRepository from "../repositories/getCart";

const getCart = async (customerId: string): Promise<CartItems> => {
  return await getCartFromRepository(customerId);
};

export default getCart;
