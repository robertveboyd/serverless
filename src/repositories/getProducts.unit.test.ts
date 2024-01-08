import getProducts from "./getProducts";
import seedProducts from "../seed/data/products.json";

describe("getProducts repository tests", () => {
  it("should retrive ALL products", async () => {
    const results = await getProducts();
    expect(results).toHaveLength(seedProducts.length);
    expect(results).toEqual(expect.arrayContaining(seedProducts));
    expect(seedProducts).toEqual(expect.arrayContaining(results));
  });
});
