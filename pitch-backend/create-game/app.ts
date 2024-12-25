import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

type GameData = {
  gameId: string;
  roundsPlayed: number;
  hands: { [player: string]: string[] };
  scores: { [player: string]: number }[]; // Updated to array of objects
  players: string[];
  createdDate: string;
};

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse the incoming request body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const body: { players: string[] } = JSON.parse(event.body);

    if (!body.players || !Array.isArray(body.players) || body.players.length < 2) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid players list" }),
      };
    }

    // Generate gameId and prepare game data
    const gameId = generateGameId();
    const players: string[] = body.players;

    // Create an array of objects for scores
    const scores = players.map((player) => ({ [player]: 0 })); // [{ 'TJ': 0 }, { 'Kenzie': 0 }, ...]

    const gameData: GameData = {
      gameId,
      roundsPlayed: 0,
      players,
      hands: {},
      scores,
      createdDate: new Date().toISOString(),
    };

    const params = {
      TableName: GAME_TABLE,
      Item: gameData,
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Game created successfully",
        gameId,
      }),
    };
  } catch (error) {
    console.error("Error creating game:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create game" }),
    };
  }
};

function generateGameId(): string {
  return Math.random().toString(36).slice(2, 11);
}
