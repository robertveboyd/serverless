import Dynamo from "../common/dynamo/dynamo";
import ErrorMessage from "../common/errors/ErrorMessage";
import { Product } from "../models/product";

const getProduct = async (name: string): Promise<Product> => {
  const pk = { attribute: process.env.PRODUCT_PARTITION_KEY, value: name };
  const product = await Dynamo.getOne(process.env.PRODUCT_TABLE!, pk);
  if (!product) {
    throw new Error(ErrorMessage.DATA_NOT_FOUND);
  }
  return product;
};

export default getProduct;
