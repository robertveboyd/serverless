import getOrders from "./getOrders";
import * as getOrdersFromRepository from "../repositories/getOrders";
import ErrorMessage from "../common/errors/ErrorMessage";

describe("getOrders service tests", () => {
  it("should get orders", async () => {
    const mockCustomerId = "ABC-123";
    const mockOrders = [
      {
        CustomerId: "ABC-123",
        OrderDate: "2023-12-20T14:17:13.111Z",
        Products: [{ ProductName: "Product3" }, { ProductName: "Product4" }],
      },
      {
        CustomerId: "ABC-123",
        OrderDate: "2023-12-20T14:18:13.111Z",
        Products: [{ ProductName: "Product5" }],
      },
    ];

    jest
      .spyOn(getOrdersFromRepository, "default")
      .mockResolvedValueOnce(mockOrders);

    await expect(getOrders(mockCustomerId)).resolves.toMatchObject(mockOrders);
  });

  it("should throw DATA_NOT_FOUND error", async () => {
    const mockCustomerId = "no-1d";
    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);

    jest
      .spyOn(getOrdersFromRepository, "default")
      .mockRejectedValueOnce(mockError);

    await expect(getOrders(mockCustomerId)).rejects.toThrow(mockError);
  });
});
