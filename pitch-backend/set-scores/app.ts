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
    const scores: { [player: string]: number } = JSON.parse(event.body!); // Scores for multiple players

    // Validate the scores object
    if (Object.values(scores).some(score => typeof score !== 'number')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid score value" }),
      };
    }

    // Build the update expression dynamically for all players
    const updateExpression = Object.keys(scores)
      .map(player => `SET scores.#${player} = :${player}`)
      .join(', ');

    // Define a specific type for ExpressionAttributeNames and ExpressionAttributeValues
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    // Populate expressionAttributeNames and expressionAttributeValues
    Object.keys(scores).forEach(player => {
      expressionAttributeNames[`#${player}`] = player;
      expressionAttributeValues[`:${player}`] = scores[player];
    });

    // Update the scores for the players
    const params = {
      TableName: GAME_TABLE,
      Key: { gameId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
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
    console.error("Error updating scores:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to set scores" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  }
};
