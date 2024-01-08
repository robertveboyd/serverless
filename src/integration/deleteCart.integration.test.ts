import { handler as deleteCart } from "../handlers/deleteCart";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../common/errors/ErrorMessage";
import getStatusCodeFromError from "../common/errors/getStatusCodeFromError";
import seedCart from "../seed/data/cart.json";

describe("deleteCart integration tests", () => {
  it("should delete cart", async () => {
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

    const result = (await deleteCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({}));
  });

  it("should return error message if cart does not exists", async () => {
    const mockCustomerId = "no-1d";
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

    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);

    const result = (await deleteCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
