import { handler as createOrder } from ".";
import * as createOrderFromService from "../../services/createOrder";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";
import ErrorMessage from "../../common/errors/ErrorMessage";

describe("createOrder handler tests", () => {
  it("should create order successfully", async () => {
    const mockCustomerId = "ABC-123";
    const mockProductNames = ["Product1", "Product2"];
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

    const mockOrder = {
      CustomerId: mockCustomerId,
      Products: [
        { ProductName: mockProductNames[0] },
        { ProductName: mockProductNames[1] },
      ],
      OrderDate: new Date().toISOString(),
    };

    jest
      .spyOn(createOrderFromService, "default")
      .mockResolvedValueOnce(mockOrder);

    const result = (await createOrder(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    expect(result.body).toBe(JSON.stringify({ order: mockOrder }));
  });

  it("should return UNAUTHORIZED", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.UNAUTHORIZED);

    const result = (await createOrder(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error if cart is empty", async () => {
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
      .spyOn(createOrderFromService, "default")
      .mockRejectedValueOnce(mockError);

    const result = (await createOrder(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });

  it("should return error message if order already exists", async () => {
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

    const mockError = new Error(ErrorMessage.ITEM_ALREADY_EXISTS);

    jest
      .spyOn(createOrderFromService, "default")
      .mockRejectedValueOnce(mockError);

    const result = (await createOrder(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
