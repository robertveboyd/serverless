import getProducts from "./getProducts";
import * as getProductsFromRepository from "../repositories/getProducts";

describe("getProducts service tests", () => {
  it("should get products", async () => {
    const mockProducts = [
      {
        Name: "Product1",
      },
      {
        Name: "Product2",
      },
    ];

    jest
      .spyOn(getProductsFromRepository, "default")
      .mockResolvedValueOnce(mockProducts);

    await expect(getProducts()).resolves.toMatchObject(mockProducts);
  });
});
