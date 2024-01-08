import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Callback,
} from "aws-lambda";
import getProducts from "../../services/getProducts";
import Responses from "../../common/api/api_responses";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const products = await getProducts();
    return Responses[200]({ products });
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
