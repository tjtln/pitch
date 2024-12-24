import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  const { player } = event.pathParameters.player;

  const params = {
    TableName: process.env.HANDS_TABLE!,
    Key: {
      player,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Hand not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    console.error('Error fetching item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to retrieve hand' }),
    };
  }
};