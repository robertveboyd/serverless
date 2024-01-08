import Dynamo from "../common/dynamo/dynamo";
import ErrorMessage from "../common/errors/ErrorMessage";

const deleteCartItem = async (customerId: string) => {
  try {
    const pk = { attribute: process.env.CART_PARTITION_KEY, value: customerId };
    const sk = process.env.CART_SORT_KEY;
    const count = await Dynamo.deleteMany(process.env.CART_TABLE!, pk, sk);
    if (!count) {
      throw new Error(ErrorMessage.DATA_NOT_FOUND);
    }
  } catch (error) {
    throw error;
  }
};

export default deleteCartItem;
