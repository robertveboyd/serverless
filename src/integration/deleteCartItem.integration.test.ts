import { handler as deleteCartItem } from "../handlers/deleteCartItem";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../common/errors/ErrorMessage";
import getStatusCodeFromError from "../common/errors/getStatusCodeFromError";
import seedCart from "../seed/data/cart.json";
import seedProducts from "../seed/data/products.json";

describe("deleteCartItem integration tests", () => {
  it("should delete cartItem", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockProductName = seedCart[0].ProductName;
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {
        productName: mockProductName,
      },
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

    const result = (await deleteCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({}));
  });

  it("should return error message if cart item does not exists", async () => {
    const mockCustomerId = seedCart[0].CustomerId;
    const mockProductName = seedProducts[5].Name;
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {
        productName: mockProductName,
      },
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

    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);

    const result = (await deleteCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
