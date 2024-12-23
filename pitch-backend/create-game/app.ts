import { APIGatewayProxyEvent } from "aws-lambda";

const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  const { gameId, players, settings } = JSON.parse(event.body ?? "");

  const params = {
    TableName: process.env.GAME_TABLE ?? "undefined",
    Item: {
      gameId,
      players,
      settings,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Game created successfully!', gameId }),
    };
  } catch (error) {
    console.error('Error creating game:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create game' }),
    };
  }
};
