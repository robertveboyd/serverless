import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Callback,
} from "aws-lambda";
import getCart from "../../services/getCart";
import Responses from "../../common/api/api_responses";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";
import ErrorMessage from "../../common/errors/ErrorMessage";

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
    const cart = await getCart(customerId);
    return Responses[200]({ cart });
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
