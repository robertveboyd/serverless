import getCart from "./getCart";
import * as getCartFromRepository from "../repositories/getCart";

describe("getProducts service tests", () => {
  it("should get cart", async () => {
    const mockCart = [
      {
        CustomerId: "ABC-123",
        ProductName: "Product1",
        AddedToCartDate: "2023-12-21T14:17:13.111Z",
      },
      {
        CustomerId: "ABC-123",
        ProductName: "Product2",
        AddedToCartDate: "2023-12-21T14:18:13.111Z",
      },
    ];

    jest
      .spyOn(getCartFromRepository, "default")
      .mockResolvedValueOnce(mockCart);

    await expect(getCart(mockCart[0].CustomerId)).resolves.toMatchObject(
      mockCart
    );
  });
});
