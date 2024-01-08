import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import { DeleteCartItemPathParamsSchema } from "./params/path";
import Responses from "../../common/api/api_responses";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";
import deleteCartItemFromService from "../../services/deleteCartItem";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const customerId = event.requestContext.authorizer?.claims.sub;
    if (!customerId) {
      throw new Error(ErrorMessage.UNAUTHORIZED);
    }

    const parsedPathParams = DeleteCartItemPathParamsSchema.safeParse(
      event.pathParameters
    );
    if (!parsedPathParams.success) {
      throw new Error(ErrorMessage.INVALID_PATH_PARAMS);
    }

    const { productName: encodedProductName } = parsedPathParams.data;

    const productName = decodeURIComponent(encodedProductName);

    await deleteCartItemFromService(customerId, productName);

    return Responses[200]();
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
