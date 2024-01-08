import ErrorMessage from "../common/errors/ErrorMessage";
import deleteCart from "./deleteCart";
import seedCart from "../seed/data/cart.json";

describe("deleteCart repository tests", () => {
  it("should delete cart", async () => {
    const { CustomerId: mockCustomerId } = seedCart[0];
    await expect(deleteCart(mockCustomerId)).resolves.not.toThrow();
  });

  it("should throw data not found error", async () => {
    const mockCustomerId = "no-1d";
    await expect(deleteCart(mockCustomerId)).rejects.toThrow(
      new Error(ErrorMessage.DATA_NOT_FOUND)
    );
  });
});
