import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { LoginBodyParamsSchema } from "./params/body";
import login from "../../services/login";
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

    const parsedBody = LoginBodyParamsSchema.safeParse(JSON.parse(event.body));

    if (!parsedBody.success) {
      throw new Error(ErrorMessage.INVALID_BODY_PARAMS);
    }

    const { email, password } = parsedBody.data;

    const token = await login(email, password);

    return Responses[200]({ message: "User login successful", token });
  } catch (error) {
    return Responses.fromError(error, getStatusCodeFromError);
  }
};
