import createOrder from "./createOrder";
import * as getCartFromRepository from "../repositories/getCart";
import * as createOrderFromRepository from "../repositories/createOrder";
import * as deleteCartFromRepository from "../repositories/deleteCart";

import ErrorMessage from "../common/errors/ErrorMessage";

describe("createOrder service test", () => {
  it("should create order", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductNames = ["Product1", "Product2"];
    const mockCart = [
      {
        CustomerId: mockCustomerId,
        ProductName: mockProductNames[0],
        AddedToCartDate: "2023-12-21T14:17:13.111Z",
      },
      {
        CustomerId: mockCustomerId,
        ProductName: mockProductNames[1],
        AddedToCartDate: "2023-12-21T14:18:13.111Z",
      },
    ];
    const mockOrder = {
      CustomerId: mockCustomerId,
      Products: [
        { ProductName: mockProductNames[0] },
        { ProductName: mockProductNames[1] },
      ],
      OrderDate: new Date().toISOString(),
    };
    jest
      .spyOn(getCartFromRepository, "default")
      .mockResolvedValueOnce(mockCart);
    jest
      .spyOn(createOrderFromRepository, "default")
      .mockResolvedValueOnce(mockOrder);
    jest.spyOn(deleteCartFromRepository, "default").mockResolvedValueOnce();

    await expect(createOrder(mockCustomerId)).resolves.toMatchObject(mockOrder);
  });

  it("should throw DATA NOT FOUND error if cart is empty", async () => {
    const mockCustomerId = "ABC-123";
    const mockCart = [];
    jest
      .spyOn(getCartFromRepository, "default")
      .mockResolvedValueOnce(mockCart);

    await expect(createOrder(mockCustomerId)).rejects.toThrow(
      new Error(ErrorMessage.DATA_NOT_FOUND)
    );
  });

  it("should throw DATA NOT FOUND error if cart cannot be found", async () => {
    const mockCustomerId = "ABC-123";
    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);
    jest
      .spyOn(getCartFromRepository, "default")
      .mockRejectedValueOnce(mockError);

    await expect(createOrder(mockCustomerId)).rejects.toThrow(mockError);
  });

  it("should throw ITEM_ALREADY_EXISTS error if order exists", async () => {
    const mockCustomerId = "ABC-123";
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
    const mockError = new Error(ErrorMessage.ITEM_ALREADY_EXISTS);
    jest
      .spyOn(getCartFromRepository, "default")
      .mockResolvedValueOnce(mockCart);
    jest
      .spyOn(createOrderFromRepository, "default")
      .mockRejectedValueOnce(mockError);

    await expect(createOrder(mockCustomerId)).rejects.toThrow(mockError);
  });
});
