import { handler as getCart } from "./";
import * as getCartFromService from "../../services/getCart";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

describe("get cart handler tests", () => {
  it("should return cart successfully", async () => {
    const mockCustomerId = "ABC-123";
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

    const mockCart = [
      {
        CustomerId: "ABC-123",
        ProductName: "Product1",
        AddedToCartDate: "2023-12-21T14:17:13.111Z",
      },
      {
        CustomerId: "ABC-123",
        ProductName: "Product2",
        AddedToCartDate: "2023-12-21T14:18:13.111Z",
      },
    ];

    jest.spyOn(getCartFromService, "default").mockResolvedValueOnce(mockCart);

    const result = (await getCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ cart: mockCart }));
  });

  it("should throw unauthorized error", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.UNAUTHORIZED);

    const result = (await getCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error message for invalid model params", async () => {
    const mockCustomerId = "ABC-123";
    const mockEvent = {
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

    const mockError = new Error(ErrorMessage.INVALID_MODEL_PARAMS);

    jest.spyOn(getCartFromService, "default").mockRejectedValueOnce(mockError);

    const result = (await getCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
