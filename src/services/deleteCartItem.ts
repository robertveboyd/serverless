import deleteCartItemFromRepository from "../repositories/deleteCartItem";

const deleteCartItem = async (customerId: string, productName: string) => {
  await deleteCartItemFromRepository(customerId, productName);
};

export default deleteCartItem;
