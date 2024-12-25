import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Ensure `gameId` is provided in the path parameters
    const { gameId } = event.pathParameters || {};
    if (!gameId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid gameId in path parameters" }),
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
        },
      };
    }

    // Retrieve the game data from DynamoDB
    const params = {
      TableName: GAME_TABLE,
      Key: { gameId }, // Query DynamoDB by the primary key (gameId)
    };

    const data = await dynamoDb.get(params).promise();

    // Check if the game exists
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" }),
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
        },
      };
    }

    // Extract the dealer from the game data
    const dealer = data.Item.dealer;

    return {
      statusCode: 200,
      body: JSON.stringify({ dealer }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  } catch (error) {
    console.error("Error fetching dealer:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve dealer" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  }
};
