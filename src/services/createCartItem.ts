import createCartItemFromRepository from "../repositories/createCartItem";
import getProductFromRepository from "../repositories/getProduct";
import getOrdersFromRepository from "../repositories/getOrders";
import ErrorMessage from "../common/errors/ErrorMessage";
import { CartItem } from "../models/cartItem";

const createCartItem = async (
  CustomerId: string,
  ProductName: string
): Promise<CartItem> => {
  const cartItem = {
    CustomerId,
    ProductName,
    AddedToCartDate: new Date().toISOString(),
  };

  await getProductFromRepository(ProductName);

  const orders = await getOrdersFromRepository(CustomerId);
  for (const order of orders) {
    const productNames = order.Products.map((product) => product.ProductName);
    if (productNames.includes(ProductName)) {
      throw new Error(ErrorMessage.ITEM_ALREADY_EXISTS);
    }
  }

  return await createCartItemFromRepository(cartItem);
};

export default createCartItem;
