import createOrder from "./createOrder";
import seedOrders from "../seed/data/orders.json";
import ErrorMessage from "../common/errors/ErrorMessage";

describe("createOrder repository tests", () => {
  it("should create order", async () => {
    const mockOrder = {
      CustomerId: seedOrders[0].CustomerId,
      OrderDate: new Date().toISOString(),
      Products: [
        { ProductName: "New Product 1" },
        { ProductName: "New Product 2" },
      ],
    };

    await expect(createOrder(mockOrder)).resolves.toMatchObject(mockOrder);
  });

  it("should throw INVALID_MODEL_PARAMS", async () => {
    const mockOrder = {
      CustomerId: seedOrders[0].CustomerId,
      Date: new Date().toISOString(),
      Products: [
        { ProductName: "New Product 1" },
        { ProductName: "New Product 2" },
      ],
    };

    await expect(createOrder(mockOrder)).rejects.toThrow(
      new Error(ErrorMessage.INVALID_MODEL_PARAMS)
    );
  });

  it("should throw ITEM_ALREADY_EXISTS error", async () => {
    const mockOrder = seedOrders[0];

    await expect(createOrder(mockOrder)).rejects.toThrow(
      new Error(ErrorMessage.ITEM_ALREADY_EXISTS)
    );
  });
});
