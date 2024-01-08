import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import Dynamo from "../common/dynamo/dynamo";
import ErrorMessage from "../common/errors/ErrorMessage";

const deleteCartItem = async (customerId: string, productName: string) => {
  try {
    const pk = { attribute: process.env.CART_PARTITION_KEY, value: customerId };
    const sk = { attribute: process.env.CART_SORT_KEY, value: productName };
    await Dynamo.deleteOne(process.env.CART_TABLE!, pk, sk);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException)
      throw new Error(ErrorMessage.DATA_NOT_FOUND);
    throw error;
  }
};

export default deleteCartItem;
