import { handler as createCartItem } from "../handlers/createCartItem";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../common/errors/ErrorMessage";
import getStatusCodeFromError from "../common/errors/getStatusCodeFromError";
import seedCart from "../seed/data/cart.json";
import seedProducts from "../seed/data/products.json";
import seedOrders from "../seed/data/orders.json";
import { CartItemSchema } from "../models/cartItem";

describe("createCartItem integration tests", () => {
  it("should create item", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockProductName = seedProducts[5].Name;

    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        productName: mockProductName,
      }),
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

    const result = (await createCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    const parsedCartItem = CartItemSchema.safeParse(
      JSON.parse(result.body).cartItem
    );
    expect(parsedCartItem.success).toBe(true);

    if (parsedCartItem.success) {
      const cartItem = parsedCartItem.data;
      expect(cartItem.CustomerId).toBe(mockCustomerId);
      expect(cartItem.ProductName).toBe(mockProductName);
    }
  });

  it("should return error if cart item already exists", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockProductName = seedCart[0].ProductName;

    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        productName: mockProductName,
      }),
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

    const mockError = new Error(ErrorMessage.ITEM_ALREADY_EXISTS);

    const result = (await createCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error if product is already ordered", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockProductName = seedOrders[0].Products[0].ProductName;

    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        productName: mockProductName,
      }),
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

    const mockError = new Error(ErrorMessage.ITEM_ALREADY_EXISTS);

    const result = (await createCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
