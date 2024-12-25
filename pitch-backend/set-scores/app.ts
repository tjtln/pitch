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
    const { gameId, player } = event.pathParameters!;
    const { score } = JSON.parse(event.body!); // The new score for the player

    if (score === undefined || typeof score !== "number") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid score value" }),
      };
    }

    if (!player) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Player name is required" }),
      };
    }

    // Update the player's score
    const params = {
      TableName: GAME_TABLE,
      Key: { gameId },
      UpdateExpression: "SET scores.#player = :score",
      ExpressionAttributeNames: {
        "#player": player, // player is dynamic, so we need to use a placeholder
      },
      ExpressionAttributeValues: {
        ":score": score,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();

    if (!result.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" }),
      };
    }

    const updatedGameData = result.Attributes as GameData;
    return {
      statusCode: 200,
      body: JSON.stringify({ scores: updatedGameData.scores }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  } catch (error) {
    console.error("Error updating score:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to set score" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  }
};
