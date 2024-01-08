const responseTemplate = (statusCode = 502, data = {}) => ({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
  },
  statusCode,
  body: JSON.stringify(data),
});

const Responses = {
  200: (data = {}) => responseTemplate(200, data),
  201: (data = {}) => responseTemplate(201, data),
  204: (data = {}) => responseTemplate(204, data),
  400: (data = {}) => responseTemplate(400, data),
  404: (data = {}) => responseTemplate(404, data),
  fromError: (error: Error, getStatusCode?: (error: Error) => number) =>
    responseTemplate(getStatusCode ? getStatusCode(error) : 500, {
      message: error.message,
    }),
};

export default Responses;
