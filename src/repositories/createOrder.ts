import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import Dynamo from "../common/dynamo/dynamo";
import { Order, OrderSchema } from "../models/order";
import ErrorMessage from "../common/errors/ErrorMessage";

const createOrder = async (order: Order): Promise<Order> => {
  try {
    const parsedOrder = OrderSchema.safeParse(order);
    if (!parsedOrder.success) {
      throw new Error(ErrorMessage.INVALID_MODEL_PARAMS);
    }
    await Dynamo.create(
      process.env.ORDER_TABLE,
      parsedOrder.data,
      process.env.ORDER_PARTITION_KEY,
      process.env.ORDER_SORT_KEY
    );
    return parsedOrder.data;
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException)
      throw new Error(ErrorMessage.ITEM_ALREADY_EXISTS);
    throw error;
  }
};

export default createOrder;
