import ErrorMessage from "../common/errors/ErrorMessage";
import deleteCartItem from "./deleteCartItem";
import seedCart from "../seed/data/cart.json";

describe("deleteCartItem repository tests", () => {
  it("should delete cart item", async () => {
    const { CustomerId: mockCustomerId, ProductName: mockProductName } =
      seedCart[0];
    await expect(
      deleteCartItem(mockCustomerId, mockProductName)
    ).resolves.not.toThrow();
  });

  it("should throw data not found error", async () => {
    const { CustomerId: mockCustomerId } = seedCart[0];
    const mockProductName = "New Product";
    await expect(
      deleteCartItem(mockCustomerId, mockProductName)
    ).rejects.toThrow(new Error(ErrorMessage.DATA_NOT_FOUND));
  });
});
