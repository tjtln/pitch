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

    return {
      statusCode: 200,
      body: JSON.stringify({ scores: gameData.scores }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  } catch (error) {
    console.error("Error fetching scores:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get scores" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  }
};
