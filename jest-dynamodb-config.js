module.exports = async () => {
  const fs = require("fs");
  const yaml = require("js-yaml");
  const { CLOUDFORMATION_SCHEMA } = require("js-yaml-cloudformation-schema");

  const serverlessConfig = yaml.load(
    fs.readFileSync("serverless.yml", "utf-8"),
    { schema: CLOUDFORMATION_SCHEMA }
  );

  const resources = serverlessConfig.resources.Resources;
  const dynamoDBTables = Object.keys(resources)
    .map((r) => resources[r])
    .filter((r) => r.Type === "AWS::DynamoDB::Table")
    .map((r) => r.Properties);

  // set key env variables
  const custom = serverlessConfig.custom;
  Object.keys(custom)
    .filter((key) => key.startsWith("ENV") && key.endsWith("KEY"))
    .forEach((key) => {
      process.env[key.replace("ENV_", "")] = custom[key];
    });

  // Set table name env variables
  dynamoDBTables.forEach((table) => {
    const { TableName, AttributeDefinitions, KeySchema } = table;
    process.env[`${TableName.toUpperCase()}_TABLE`] = TableName;
    // update attribute names
    AttributeDefinitions.forEach((att) => {
      const match = att.AttributeName.match(/ENV.*KEY/);
      if (match) {
        att.AttributeName = custom[match[0]];
      }
    });

    KeySchema.forEach((key) => {
      const match = key.AttributeName.match(/ENV.*KEY/);
      if (match) {
        key.AttributeName = custom[match[0]];
      }
    });
  });

  return {
    tables: dynamoDBTables,
    port: 8000,
  };
};
