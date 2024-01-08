import Dynamo from "../common/dynamo/dynamo";
import ErrorMessage from "../common/errors/ErrorMessage";
import { Products, ProductsSchema } from "../models/product";

const getProducts = async (): Promise<Products> => {
  const products = await Dynamo.getAll(process.env.PRODUCT_TABLE!);
  if (!products) {
    throw new Error(ErrorMessage.DATA_NOT_FOUND);
  }
  const parsedProducts = ProductsSchema.safeParse(products);
  if (!parsedProducts.success) {
    throw new Error(ErrorMessage.INVALID_MODEL_PARAMS);
  }
  return parsedProducts.data;
};

export default getProducts;
