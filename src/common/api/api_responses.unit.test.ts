import Responses from "./api_responses";

describe("API Responses", () => {
  const statusCodes = [200, 201, 204, 400, 404];
  const data = { name: "abc123" };

  test.each(statusCodes)(
    "should create response with statusCode %p",
    (statusCode) => {
      const res = Responses[statusCode](data);
      expect(res.statusCode).toBe(statusCode);
      expect(res.body).toBe(JSON.stringify(data));
      expect(res.headers["Content-Type"]).toBe("application/json");
    }
  );

  test("should create response from error", () => {
    const error = new Error("Unexpected Error");
    const res = Responses.fromError(error);
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify({ message: error.message }));
    expect(res.headers["Content-Type"]).toBe("application/json");
  });

  test("should create response from error and map status code", () => {
    const statusCode = 404;
    const dataNotFoundError = new Error("Data not found");
    const getStatusCodeFromError = (error: Error) => {
      switch (error.message) {
        case dataNotFoundError.message:
          return statusCode;
        default:
          return 500;
      }
    };
    const res = Responses.fromError(dataNotFoundError, getStatusCodeFromError);
    expect(res.statusCode).toBe(statusCode);
    expect(res.body).toBe(
      JSON.stringify({ message: dataNotFoundError.message })
    );
    expect(res.headers["Content-Type"]).toBe("application/json");
  });
});
