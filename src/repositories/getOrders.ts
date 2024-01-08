import Dynamo from "../common/dynamo/dynamo";
import ErrorMessage from "../common/errors/ErrorMessage";
import { Orders, OrdersSchema } from "../models/order";

const getOrders = async (customerId: string): Promise<Orders> => {
  const pk = { attribute: process.env.ORDER_PARTITION_KEY, value: customerId };
  const orders = await Dynamo.getMany(process.env.ORDER_TABLE!, pk);
  if (!orders) {
    throw new Error(ErrorMessage.DATA_NOT_FOUND);
  }
  const parsedOrders = OrdersSchema.safeParse(orders);
  if (!parsedOrders.success) {
    throw new Error(ErrorMessage.INVALID_MODEL_PARAMS);
  }
  return parsedOrders.data;
};

export default getOrders;
