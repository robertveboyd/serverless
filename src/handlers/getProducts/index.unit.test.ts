import { handler as getProducts } from "./";
import * as getProductsFromService from "../../services/getProducts";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

describe("get products handler tests", () => {
  it("should return products successfully", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockProducts = [
      {
        Name: "Product1",
      },
      {
        Name: "Product2",
      },
    ];

    jest
      .spyOn(getProductsFromService, "default")
      .mockResolvedValueOnce(mockProducts);

    const result = (await getProducts(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ products: mockProducts }));
  });

  it("should return error message for invalid model params", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      requestContext: {},
    } as any;
    const mockContext = {} as Context;
    const mockCallback = () => {};

    const mockError = new Error(ErrorMessage.INVALID_MODEL_PARAMS);

    jest
      .spyOn(getProductsFromService, "default")
      .mockRejectedValueOnce(mockError);

    const result = (await getProducts(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(getStatusCodeFromError(mockError));
    expect(result.body).toBe(JSON.stringify({ message: mockError.message }));
  });
});
