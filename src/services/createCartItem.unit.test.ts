import createCartItem from "./createCartItem";
import * as createCartItemFromRepository from "../repositories/createCartItem";
import * as getProductFromRepository from "../repositories/getProduct";
import * as getOrdersFromRepository from "../repositories/getOrders";
import ErrorMessage from "../common/errors/ErrorMessage";

describe("createCartItem service tests", () => {
  it("should create cart item", async () => {
    const mockCustomerId = "ABC-123";
    const mockProduct = {
      Name: "Product1",
    };
    const mockOrders = [];
    const mockCartItem = {
      CustomerId: mockCustomerId,
      ProductName: mockProduct.Name,
      AddedToCartDate: new Date().toISOString(),
    };
    jest
      .spyOn(getProductFromRepository, "default")
      .mockResolvedValueOnce(mockProduct);
    jest
      .spyOn(createCartItemFromRepository, "default")
      .mockResolvedValueOnce(mockCartItem);
    jest
      .spyOn(getOrdersFromRepository, "default")
      .mockResolvedValueOnce(mockOrders);
    await expect(
      createCartItem(mockCustomerId, mockProduct.Name)
    ).resolves.toMatchObject(mockCartItem);
  });

  it("should throw error if cart item exists", async () => {
    const mockCustomerId = "ABC-123";
    const mockProduct = {
      Name: "Product1",
    };
    const mockError = new Error(ErrorMessage.ITEM_ALREADY_EXISTS);
    jest
      .spyOn(getProductFromRepository, "default")
      .mockResolvedValueOnce(mockProduct);
    jest
      .spyOn(createCartItemFromRepository, "default")
      .mockRejectedValueOnce(mockError);
    await expect(
      createCartItem(mockCustomerId, mockProduct.Name)
    ).rejects.toThrow(mockError);
  });

  it("should throw error if product does not exist", async () => {
    const mockCustomerId = "ABC-123";
    const mockProduct = {
      Name: "Product1",
    };
    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);
    jest
      .spyOn(getProductFromRepository, "default")
      .mockRejectedValueOnce(mockError);
    await expect(
      createCartItem(mockCustomerId, mockProduct.Name)
    ).rejects.toThrow(mockError);
  });

  it("should throw error if product is already ordered", async () => {
    const mockCustomerId = "ABC-123";
    const mockProduct = {
      Name: "Product1",
    };
    const mockOrders = [
      {
        CustomerId: mockCustomerId,
        OrderDate: new Date().toISOString(),
        Products: [{ ProductName: mockProduct.Name }],
      },
    ];
    const mockCartItem = {
      CustomerId: mockCustomerId,
      ProductName: mockProduct.Name,
      AddedToCartDate: new Date().toISOString(),
    };

    const mockError = new Error(ErrorMessage.ITEM_ALREADY_EXISTS);
    jest
      .spyOn(getProductFromRepository, "default")
      .mockResolvedValueOnce(mockProduct);
    jest
      .spyOn(createCartItemFromRepository, "default")
      .mockResolvedValueOnce(mockCartItem);
    jest
      .spyOn(getOrdersFromRepository, "default")
      .mockResolvedValueOnce(mockOrders);
    await expect(
      createCartItem(mockCustomerId, mockProduct.Name)
    ).rejects.toThrow(mockError);
  });
});
