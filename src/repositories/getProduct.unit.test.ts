import getProduct from "./getProduct";
import seedProducts from "../seed/data/products.json";
import ErrorMessage from "../common/errors/ErrorMessage";

describe("getProducts repository tests", () => {
  it("should retrive product", async () => {
    const results = await getProduct(seedProducts[0].Name);
    expect(results).toMatchObject(seedProducts[0]);
  });

  it("should throw error if no product exists", async () => {
    const mockName = "New Product";
    await expect(getProduct(mockName)).rejects.toThrow(
      new Error(ErrorMessage.DATA_NOT_FOUND)
    );
  });
});
