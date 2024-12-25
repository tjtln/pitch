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

    const params = {
      TableName: GAME_TABLE,
      Key: { gameId },
      UpdateExpression: "set #turn = :turn",
      ExpressionAttributeNames: {
        "#turn": "turn",
      },
      ExpressionAttributeValues: {
        ":turn": player,
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
      body: JSON.stringify({ turn: updatedGameData.turn }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  } catch (error) {
    console.error("Error updating turn:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to set turn" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  }
};
