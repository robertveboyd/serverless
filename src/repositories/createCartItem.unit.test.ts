import ErrorMessage from "../common/errors/ErrorMessage";
import createCartItem from "./createCartItem";
import seedCart from "../seed/data/cart.json";

describe("createCartItem repository tests", () => {
  it("should create cart item", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockCartItem = {
      CustomerId: mockCustomerId,
      ProductName: "New Product",
      AddedToCartDate: new Date().toISOString(),
    };

    await expect(createCartItem(mockCartItem)).resolves.toMatchObject(
      mockCartItem
    );
  });

  it("should throw INVALID_MODEL_PARAMS", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockCartItem = {
      CustomerId: mockCustomerId,
      ProductName: "Product1",
      Date: new Date().toISOString(),
    };

    await expect(createCartItem(mockCartItem)).rejects.toThrow(
      new Error(ErrorMessage.INVALID_MODEL_PARAMS)
    );
  });

  it("should throw error if cart item exists", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockProductName = seedCart[0].ProductName;
    const mockCartItem = {
      CustomerId: mockCustomerId,
      ProductName: mockProductName,
      AddedToCartDate: new Date().toISOString(),
    };

    await expect(createCartItem(mockCartItem)).rejects.toThrow(
      new Error(ErrorMessage.ITEM_ALREADY_EXISTS)
    );
  });
});
