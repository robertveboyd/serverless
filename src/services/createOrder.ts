import ErrorMessage from "../common/errors/ErrorMessage";
import createOrderFromRepository from "../repositories/createOrder";
import getCartFromRepository from "../repositories/getCart";
import deleleCartFromRepository from "../repositories/deleteCart";
import { Order } from "../models/order";

const createOrder = async (CustomerId: string): Promise<Order> => {
  const cart = await getCartFromRepository(CustomerId);
  if (cart.length === 0) {
    throw new Error(ErrorMessage.DATA_NOT_FOUND);
  }
  const OrderDate = new Date().toISOString();
  const Products = cart.map((cartItem) => ({
    ProductName: cartItem.ProductName,
  }));
  const order = {
    CustomerId,
    OrderDate,
    Products,
  };
  await deleleCartFromRepository(CustomerId);
  return await createOrderFromRepository(order);
};

export default createOrder;
