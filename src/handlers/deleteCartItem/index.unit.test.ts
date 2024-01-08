import { handler as deleteCartItem } from "./";
import * as deleteCartItemFromService from "../../services/deleteCartItem";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

describe("deleteCartItem handler tests", () => {
  it("should delete cart item successfully", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductName = "Product1";
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

    jest.spyOn(deleteCartItemFromService, "default").mockResolvedValueOnce();

    const result = (await deleteCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({}));
  });

  it("should throw unauthorized error", async () => {
    const mockProductName = "Product 1";
    const mockEvent: APIGatewayProxyEvent = {
      pathParameters: {
        productName: mockProductName,
      },
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.UNAUTHORIZED);

    const result = (await deleteCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error message if cart item does not exists", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductName = "Product1";
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

    jest
      .spyOn(deleteCartItemFromService, "default")
      .mockRejectedValueOnce(mockError);

    const result = (await deleteCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error if path parameter does not exist", async () => {
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

    const mockError = new Error(ErrorMessage.INVALID_PATH_PARAMS);

    const result = (await deleteCartItem(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
