import { handler as createCartItem } from "./";
import * as createCartItemFromService from "../../services/createCartItem";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

describe("createCartItem handler tests", () => {
  it("should create cart item successfully", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductName = "Product 1";
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

    const mockCartItem = {
      CustomerId: mockCustomerId,
      ProductName: mockProductName,
      AddedToCartDate: new Date().toISOString(),
    };

    jest
      .spyOn(createCartItemFromService, "default")
      .mockResolvedValueOnce(mockCartItem);

    const result = (await createCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    expect(result.body).toBe(
      JSON.stringify({
        cartItem: mockCartItem,
      })
    );
  });

  it("should throw unauthorized error", async () => {
    const mockProductName = "Product 1";
    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        productName: mockProductName,
      }),
      requestContext: {},
    } as any;

    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.UNAUTHORIZED);

    const result = (await createCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error message if cart item already exists", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductName = "Product 1";
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

    jest
      .spyOn(createCartItemFromService, "default")
      .mockRejectedValueOnce(mockError);

    const result = (await createCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
