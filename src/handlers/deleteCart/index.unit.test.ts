import { handler as deleteCart } from "./";
import * as deleteCartFromService from "../../services/deleteCart";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

describe("deleteCart handler tests", () => {
  it("should delete cart successfully", async () => {
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

    jest.spyOn(deleteCartFromService, "default").mockResolvedValueOnce();

    const result = (await deleteCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({}));
  });

  it("should throw unauthorized error", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.UNAUTHORIZED);

    const result = (await deleteCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error message if cart does not exists", async () => {
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

    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);

    jest
      .spyOn(deleteCartFromService, "default")
      .mockRejectedValueOnce(mockError);

    const result = (await deleteCart(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
