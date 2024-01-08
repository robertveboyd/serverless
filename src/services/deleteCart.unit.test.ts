import deleteCart from "./deleteCart";
import * as deleteCartFromRepository from "../repositories/deleteCart";
import ErrorMessage from "../common/errors/ErrorMessage";

describe("deleteCartItem service tests", () => {
  it("should delete cart", async () => {
    const mockCustomerId = "ABC-123";
    jest.spyOn(deleteCartFromRepository, "default").mockResolvedValueOnce();
    await expect(deleteCart(mockCustomerId)).resolves.not.toThrow();
  });

  it("should throw data not found error", async () => {
    const mockCustomerId = "no-1d";
    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);
    jest
      .spyOn(deleteCartFromRepository, "default")
      .mockRejectedValueOnce(mockError);
    await expect(deleteCart(mockCustomerId)).rejects.toThrow(mockError);
  });
});
