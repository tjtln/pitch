import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { gameId } = event.pathParameters || {};
  const { phase } = event.pathParameters || {};

  if (!gameId || !phase || typeof phase !== "string") {
    return {
      statusCode: 400,
       body: JSON.stringify({ error: "Invalid game ID or phase format" }),
    };
  }

  try {
    await dynamoDb
      .update({
        TableName: GAME_TABLE,
        Key: { gameId },
        UpdateExpression: "SET phase = :phase",
        ExpressionAttributeValues: {
          ":phase": phase,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Phase updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating phase:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update phase" }),
    };
  }
};
