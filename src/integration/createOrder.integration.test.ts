import { handler as createOrder } from "../handlers/createOrder";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import ErrorMessage from "../common/errors/ErrorMessage";
import getStatusCodeFromError from "../common/errors/getStatusCodeFromError";
import seedProducts from "../seed/data/products.json";
import seedOrders from "../seed/data/orders.json";
import { OrderSchema } from "../models/order";

describe("createOrder integration tests", () => {
  it("should create order", async () => {
    const mockCustomerId = seedOrders[0].CustomerId;
    const mockProductNames = [seedProducts[0].Name, seedProducts[1].Name];
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

    const result = (await createOrder(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    const parsedOrder = OrderSchema.safeParse(JSON.parse(result.body).order);
    expect(parsedOrder.success).toBe(true);

    if (parsedOrder.success) {
      const order = parsedOrder.data;
      expect(order.CustomerId).toBe(mockCustomerId);
      expect(order.Products).toHaveLength(mockProductNames.length);
      expect(order.Products).toEqual(
        expect.arrayContaining([
          { ProductName: mockProductNames[0] },
          { ProductName: mockProductNames[1] },
        ])
      );
    }
  });

  it("should return error if cart does not exist", async () => {
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

    const result = (await createOrder(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
