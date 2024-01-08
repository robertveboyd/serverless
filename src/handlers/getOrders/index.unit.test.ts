import { handler as getOrders } from ".";
import * as getOrdersFromService from "../../services/getOrders";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

describe("getOrders handler tests", () => {
  it("should get orders", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {
        authorizer: {
          claims: {
            sub: "ABC-123",
          },
        },
      },
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockOrders = [
      {
        CustomerId: "ABC-123",
        OrderDate: "2023-12-20T14:17:13.111Z",
        Products: [{ ProductName: "Product3" }, { ProductName: "Product4" }],
      },
      {
        CustomerId: "ABC-123",
        OrderDate: "2023-12-20T14:18:13.111Z",
        Products: [{ ProductName: "Product5" }],
      },
    ];

    jest
      .spyOn(getOrdersFromService, "default")
      .mockResolvedValueOnce(mockOrders);

    const result = (await getOrders(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ orders: mockOrders }));
  });

  it("should return unauthorized error", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.UNAUTHORIZED);

    const result = (await getOrders(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return data not found error", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {
        authorizer: {
          claims: {
            sub: "ABC-123",
          },
        },
      },
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.DATA_NOT_FOUND);

    jest
      .spyOn(getOrdersFromService, "default")
      .mockRejectedValueOnce(mockError);

    const result = (await getOrders(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
