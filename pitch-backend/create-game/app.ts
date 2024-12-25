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
  dealer: string;
  turn: string;
  played: string[];
  createdDate: string;
};

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
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
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
        },
      };
    }

    // Generate gameId and prepare game data
    const gameId = generateGameId();
    const players: string[] = body.players;

    // Create an array of objects for scores
    const scores = players.map((player) => ({ [player]: 0 }));

    // Assign dealer as the first player in the list
    const dealer = players[0];

    // Assign turn to the player after the dealer (or wrap around to the first player if only two players)
    const turn = players[1 % players.length];

    // Initialize game data
    const gameData: GameData = {
      gameId,
      roundsPlayed: 0,
      players,
      hands: {},
      scores,
      dealer,
      turn,
      played: [], // Start with an empty array for played cards
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
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  } catch (error) {
    console.error("Error creating game:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create game" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  }
};

function generateGameId(): string {
  return Math.random().toString(36).slice(2, 11);
}
