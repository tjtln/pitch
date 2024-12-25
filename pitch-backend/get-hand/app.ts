import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  const { gameId, player } = event.pathParameters; // Extract gameId and player from path parameters

  const params = {
    TableName: process.env.GAME_TABLE!, // Use the GAME_TABLE for fetching the hand
    Key: {
      gameId, // Primary key: gameId
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Game not found' }),
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
        },
      };
    }

    const hands = data.Item.hands;
    if (!hands || !hands[player]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Player hand not found' }),
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
        },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ player, hand: hands[player] }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  } catch (error) {
    console.error('Error fetching item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to retrieve hand' }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    };
  }
};
