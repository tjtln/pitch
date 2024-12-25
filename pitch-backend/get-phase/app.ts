import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { gameId } = event.pathParameters || {};

  if (!gameId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Game ID is required" }),
    };
  }

  try {
    const result = await dynamoDb
      .get({
        TableName: GAME_TABLE,
        Key: { gameId },
        ProjectionExpression: "phase",
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item.phase),
    };
  } catch (error) {
    console.error("Error fetching phase:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch phase" }),
    };
  }
};
