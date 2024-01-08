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
import { CreateCartItemBodyParamsSchema } from "./params/body";
import createCartItemFromService from "../../services/createCartItem";

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

    if (!event.body) {
      throw new Error(ErrorMessage.INVALID_BODY_PARAMS);
    }

    const parsedBody = CreateCartItemBodyParamsSchema.safeParse(
      JSON.parse(event.body)
    );

    if (!parsedBody.success) {
      throw new Error(ErrorMessage.INVALID_BODY_PARAMS);
    }

    const { productName } = parsedBody.data;

    const cartItem = await createCartItemFromService(customerId, productName);

    return Responses[201]({ cartItem });
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
