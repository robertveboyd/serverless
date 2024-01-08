import getOrdersFromRepository from "../repositories/getOrders";
import { Orders } from "../models/order";

const getOrders = async (customerId: string): Promise<Orders> => {
  return await getOrdersFromRepository(customerId);
};

export default getOrders;
