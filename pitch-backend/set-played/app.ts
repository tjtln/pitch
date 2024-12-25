import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

type GameData = {
  gameId: string;
  roundsPlayed: number;
  hands: { [player: string]: string[] };
  scores: { [player: string]: number }[];
  players: string[];
  createdDate: string;
  dealer: string;
  turn: string;
  played: string[];
};

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { gameId } = event.pathParameters!;
    const { playedCards } = JSON.parse(event.body!);

    // Validate playedCards input
    if (!Array.isArray(playedCards)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid input. playedCards should be an array." }),
      };
    }

    // Fetch the game data from DynamoDB
    const params = {
      TableName: GAME_TABLE,
      Key: { gameId },
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" }),
      };
    }

    const gameData = result.Item as GameData;

    // Update the played cards
    gameData.played = [...gameData.played, ...playedCards];

    const updateParams = {
      TableName: GAME_TABLE,
      Key: { gameId },
      UpdateExpression: "set played = :played",
      ExpressionAttributeValues: {
        ":played": gameData.played,
      },
      ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Played cards updated successfully" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error updating played cards:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to set played cards" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
