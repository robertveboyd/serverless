import seedCart from "../seed/data/cart.json";
import getCart from "./getCart";

describe("getCart repository tests", () => {
  it("should retrive cart", async () => {
    const results = await getCart(seedCart[0].CustomerId);
    expect(results).toHaveLength(seedCart.length);
    expect(results).toEqual(expect.arrayContaining(seedCart));
    expect(seedCart).toEqual(expect.arrayContaining(results));
  });

  it("should retrieve empty cart", async () => {
    const mockCustomerId = "no-1d";
    const results = await getCart(mockCustomerId);
    expect(results).toHaveLength(0);
    expect(results).toMatchObject([]);
  });
});
