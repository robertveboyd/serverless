import { handler as getCart } from "../handlers/getCart";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import seedCart from "../seed/data/cart.json";
import { CartItemsSchema } from "../models/cartItem";

describe("getCart integration tests", () => {
  it("should get carts", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {
        authorizer: {
          claims: {
            sub: mockCustomerId,
          },
        },
      },
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const result = (await getCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    const parsedCart = CartItemsSchema.safeParse(JSON.parse(result.body).cart);
    expect(parsedCart.success).toBe(true);
    if (parsedCart.success) {
      const cart = parsedCart.data;
      expect(cart).toEqual(expect.arrayContaining(seedCart));
    }
  });
});
