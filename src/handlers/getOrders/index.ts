import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import getOrdersFromService from "../../services/getOrders";
import Responses from "../../common/api/api_responses";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

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

    const orders = await getOrdersFromService(customerId);

    return Responses[200]({ orders });
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
