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

    // Get the game data from DynamoDB
    const params = {
      TableName: GAME_TABLE,
      Key: {
        gameId: gameId,
      },
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    // Assume players are stored in an array under the 'players' attribute
    const players = result.Item.players || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ players }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error retrieving players:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve players" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
