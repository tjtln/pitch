import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get the gameId from the path parameters
    const { gameId } = event.pathParameters || {};

    if (!gameId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "gameId path parameter is required" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    // Parse the request body to get players
    const body = event.body ? JSON.parse(event.body) : null;

    if (!body || !Array.isArray(body.players)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body must include a 'players' array" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    const players = body.players;

    // Update the game in DynamoDB
    const params = {
      TableName: GAME_TABLE,
      Key: { gameId },
      UpdateExpression: "SET players = :players",
      ExpressionAttributeValues: {
        ":players": players,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Players updated successfully",
        updatedAttributes: result.Attributes,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error setting players:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update players" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
