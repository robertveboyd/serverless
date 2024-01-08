import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandInput,
  PutCommand,
  PutCommandInput,
  GetCommand,
  GetCommandInput,
  QueryCommand,
  QueryCommandInput,
  DeleteCommandInput,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const config = {};

if (["test"].includes(process.env.NODE_ENV!)) {
  config["endpoint"] = "http://localhost:8000";
  config["sslEnabled"] = false;
}

const client = new DynamoDBClient(config);
const docClient = DynamoDBDocumentClient.from(client);

const Dynamo = {
  getAll: async (TableName: string) => {
    const params: ScanCommandInput = {
      TableName,
    };

    const data = await docClient.send(new ScanCommand(params));

    return data?.Items;
  },
  create: async (
    TableName: string,
    Item: Record<string, any>,
    pk: string,
    sk?: string
  ) => {
    const ConditionExpression =
      `attribute_not_exists(${pk})` +
      (sk ? ` AND attribute_not_exists(${sk})` : "");

    const params: PutCommandInput = {
      TableName,
      Item,
      ConditionExpression,
    };

    await docClient.send(new PutCommand(params));
  },
  getOne: async (
    TableName: string,
    pk: { attribute: string; value: any },
    sk?: { attribue: string; value: any }
  ) => {
    const Key = {
      [pk.attribute]: pk.value,
      ...(sk && { [sk.attribue]: sk.value }),
    };
    const params: GetCommandInput = {
      TableName,
      Key,
    };

    const data = await docClient.send(new GetCommand(params));

    return data?.Item;
  },
  getMany: async (TableName: string, pk: { attribute: string; value: any }) => {
    const KeyConditionExpression = `${pk.attribute} = :${pk.attribute}`;
    const ExpressionAttributeValues = {
      [`:${pk.attribute}`]: pk.value,
    };
    const params: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    };

    const data = await docClient.send(new QueryCommand(params));

    return data?.Items;
  },
  put: async (TableName: string, Item: Record<string, any>) => {
    const params: PutCommandInput = {
      TableName,
      Item,
    };

    await docClient.send(new PutCommand(params));
  },
  deleteOne: async (
    TableName: string,
    pk: { attribute: string; value: any },
    sk?: { attribute: string; value: any }
  ) => {
    const Key = {
      [pk.attribute]: pk.value,
      ...(sk && { [sk.attribute]: sk.value }),
    };
    const ConditionExpression =
      `attribute_exists(${pk.attribute})` +
      (sk ? ` AND attribute_exists(${sk.attribute})` : "");

    const params: DeleteCommandInput = {
      TableName,
      Key,
      ConditionExpression,
    };

    await docClient.send(new DeleteCommand(params));
  },
  deleteMany: async (
    TableName: string,
    pk: { attribute: string; value: any },
    sk: string
  ) => {
    const KeyConditionExpression = `${pk.attribute} = :${pk.attribute}`;
    const ExpressionAttributeValues = {
      [`:${pk.attribute}`]: pk.value,
    };
    const queryParams: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    };

    const data = await docClient.send(new QueryCommand(queryParams));

    if (!data || data.Count === 0) {
      return 0;
    }

    for (const item of data.Items) {
      const Key = {
        [pk.attribute]: pk.value,
        [sk]: item[sk],
      };
      const deleteParams: DeleteCommandInput = {
        TableName,
        Key,
      };
      await docClient.send(new DeleteCommand(deleteParams));
    }

    return data.Count;
  },
};

export default Dynamo;
