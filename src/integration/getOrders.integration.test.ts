import { handler as getOrders } from "../handlers/getOrders";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import seedOrders from "../seed/data/orders.json";
import { OrdersSchema } from "../models/order";

describe("getOrders intergration tests", () => {
  it("should get orders", async () => {
    const mockCustomerId = seedOrders[0].CustomerId;
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

    const result = (await getOrders(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    const parsedOrders = OrdersSchema.safeParse(JSON.parse(result.body).orders);
    expect(parsedOrders.success).toBe(true);
    if (parsedOrders.success) {
      const orders = parsedOrders.data;
      expect(orders).toEqual(expect.arrayContaining(seedOrders));
    }
  });
});
