module.exports = {
  // preset: "ts-jest",
  preset: "@shelf/jest-dynamodb",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testEnvironment: "jest-environment-node",
  setupFilesAfterEnv: ["./setupTests"],
};
