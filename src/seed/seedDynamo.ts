const {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    endpoint: "http://localhost:8000",
  })
);

const seedDynamo = async (seedData: Record<string, Record<string, any>[]>) => {
  for (const TableName of Object.keys(seedData)) {
    for (const Item of seedData[TableName]) {
      await client.send(
        new PutCommand({
          TableName,
          Item,
        })
      );
    }
  }
};

const clearDynamo = async (seedData: Record<string, Record<string, any>[]>) => {
  for (const TableName of Object.keys(seedData)) {
    const pk = process.env[`${TableName.toUpperCase()}_PARTITION_KEY`];
    const sk = process.env[`${TableName.toUpperCase()}_SORT_KEY`];
    for (const Item of seedData[TableName]) {
      const Key = {
        [pk]: Item[pk],
        ...(sk && { [sk]: Item[sk] }),
      };
      await client.send(
        new DeleteCommand({
          TableName,
          Key,
        })
      );
    }
  }
};

module.exports = {
  seedDynamo,
  clearDynamo,
};
