import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

type Player = {
  name: string;
  score: number;
  hand: string[];
};

type GameData = {
  gameId: string;
  roundsPlayed: number;
  players: Player[];
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
    const players: Player[] = body.players.map((name) => ({
      name,
      score: 0,
      hand: [], // Initially empty hands
    }));
    const gameData: GameData = {
      gameId,
      roundsPlayed: 0,
      players,
    };

    // Insert the game object into DynamoDB
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

// Helper function to generate a unique game ID
function generateGameId(): string {
  return Math.random().toString(36).slice(2, 11); // Generate a 9-character ID
}
