import { handler as getProducts } from "../handlers/getProducts";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import seedProducts from "../seed/data/products.json";
import { ProductsSchema } from "../models/product";

describe("getProducts intergration tests", () => {
  it("should get products", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const result = (await getProducts(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    const parsedProducts = ProductsSchema.safeParse(
      JSON.parse(result.body).products
    );
    expect(parsedProducts.success).toBe(true);
    if (parsedProducts.success) {
      const products = parsedProducts.data;
      expect(products).toEqual(expect.arrayContaining(seedProducts));
    }
  });
});
