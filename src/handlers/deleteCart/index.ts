import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";
import ErrorMessage from "../../common/errors/ErrorMessage";
import Responses from "../../common/api/api_responses";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";
import deleteCartFromService from "../../services/deleteCart";

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

    await deleteCartFromService(customerId);

    return Responses[200]();
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
