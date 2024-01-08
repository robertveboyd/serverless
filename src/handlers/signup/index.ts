import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { SignupBodyParamsSchema } from "./params/body";
import signup from "../../services/signup";
import ErrorMessage from "../../common/errors/ErrorMessage";
import Responses from "../../common/api/api_responses";
import getStatusCodeFromError from "../../common/errors/getStatusCodeFromError";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new Error(ErrorMessage.INVALID_BODY_PARAMS);
    }

    const parsedBody = SignupBodyParamsSchema.safeParse(JSON.parse(event.body));

    if (!parsedBody.success) {
      throw new Error(ErrorMessage.INVALID_BODY_PARAMS);
    }

    const { email, password } = parsedBody.data;

    await signup(email, password);

    return Responses[200]({ message: "User creation successful" });
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
