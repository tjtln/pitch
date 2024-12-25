import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDb = new DynamoDB.DocumentClient();
const GAME_TABLE = process.env.GAME_TABLE!;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { gameId, player } = event.pathParameters!; // Extract both gameId and player from the path parameters

  // Fetch the game data from DynamoDB
  const params = {
    TableName: GAME_TABLE,
    Key: {
      gameId, // Use the gameId to fetch the game data
    },
  };

  try {
    const data = await dynamoDb.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Game not found' }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow all origins
        },
      };
    }

    // Check if the player exists in the players list
    const players = data.Item.players;
    if (!players.includes(player)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Player ${player} not found in game` }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    // Update the dealer in the game data
    const updateParams = {
      TableName: GAME_TABLE,
      Key: {
        gameId, // Use the gameId to identify the game
      },
      UpdateExpression: 'set dealer = :dealer',
      ExpressionAttributeValues: {
        ':dealer': player, // Set the specified player as the dealer
      },
      ReturnValues: 'ALL_NEW', // Return the updated game data
    };

    const updateResult = await dynamoDb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Dealer set successfully',
        dealer: updateResult.Attributes?.dealer,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
      },
    };
  } catch (error) {
    console.error('Error setting dealer:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to set dealer' }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
      },
    };
  }
};
