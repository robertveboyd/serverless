import getOrders from "./getOrders";
import seedOrders from "../seed/data/orders.json";

describe("getOrders repository tests", () => {
  it("should get orders", async () => {
    const customerId = seedOrders[0].CustomerId;
    const orders = await getOrders(customerId);
    expect(orders).toHaveLength(seedOrders.length);
    expect(orders).toEqual(expect.arrayContaining(seedOrders));
    expect(seedOrders).toEqual(expect.arrayContaining(orders));
  });

  it("should not have any orders for unknown customerId", async () => {
    const customerId = "no-1d";
    const orders = await getOrders(customerId);
    expect(orders).toHaveLength(0);
    expect(orders).toMatchObject([]);
  });
});
