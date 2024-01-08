import deleteCartFromRepository from "../repositories/deleteCart";

const deleteCartItem = async (customerId: string) => {
  await deleteCartFromRepository(customerId);
};

export default deleteCartItem;
