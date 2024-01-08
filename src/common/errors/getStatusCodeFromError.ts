import ErrorMessage from "./ErrorMessage";

const getStatusCodeFromError = (error: Error) => {
  switch (error.message) {
    case ErrorMessage.INVALID_BODY_PARAMS:
    case ErrorMessage.INVALID_PATH_PARAMS:
      return 400;
    case ErrorMessage.UNAUTHORIZED:
      return 401;
    case ErrorMessage.DATA_NOT_FOUND:
      return 404;
    case ErrorMessage.ITEM_ALREADY_EXISTS:
      return 409;
    case ErrorMessage.INVALID_MODEL_PARAMS:
    default:
      return 500;
  }
};

export default getStatusCodeFromError;
