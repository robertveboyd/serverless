import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import createOrderFromService from "../../services/createOrder";
import ErrorMessage from "../../common/errors/ErrorMessage";
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
    const order = await createOrderFromService(customerId);
    return Responses[201]({ order });
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
