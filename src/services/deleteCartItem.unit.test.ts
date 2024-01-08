import deleteCartItem from "./deleteCartItem";
import * as deleteCartItemFromRepository from "../repositories/deleteCartItem";
import ErrorMessage from "../common/errors/ErrorMessage";

describe("deleteCartItem service tests", () => {
  it("should delete cart item", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductName = "Product1";
    jest.spyOn(deleteCartItemFromRepository, "default").mockResolvedValueOnce();
    await expect(
      deleteCartItem(mockCustomerId, mockProductName)
    ).resolves.not.toThrow();
  });

  it("should throw data not found error", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductName = "Product1";
    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);
    jest
      .spyOn(deleteCartItemFromRepository, "default")
      .mockRejectedValueOnce(mockError);
    await expect(
      deleteCartItem(mockCustomerId, mockProductName)
    ).rejects.toThrow(mockError);
  });
});
