import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { gameId } = event.pathParameters || {};
  const { player, suit, bid } = JSON.parse(event.body || "{}");

  // Validate input
  if (!gameId || !player || !suit || typeof bid !== "number") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid game ID, player, suit, or bid" }),
    };
  }

  try {
    // Fetch the game data from DynamoDB
    const gameDataResult = await dynamoDb
      .get({
        TableName: GAME_TABLE,
        Key: { gameId },
      })
      .promise();

    if (!gameDataResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" }),
      };
    }

    // Retrieve the current bids (which is an array of bid objects)
    const currentBids = gameDataResult.Item.bid || {};

    // Update the bid for the specific player
    currentBids[player] = { suit, bid };

    // Update the game data in DynamoDB
    await dynamoDb
      .update({
        TableName: GAME_TABLE,
        Key: { gameId },
        UpdateExpression: "SET bid = :bid",
        ExpressionAttributeValues: {
          ":bid": currentBids,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Bid updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating bid:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update bid" }),
    };
  }
};
