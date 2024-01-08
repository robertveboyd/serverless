import { Products } from "../models/product";
import getProductsFromRepository from "../repositories/getProducts";

const getProducts = async (): Promise<Products> => {
  return await getProductsFromRepository();
};

export default getProducts;
