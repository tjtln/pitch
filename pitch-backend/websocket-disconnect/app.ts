import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId;
  if (!connectionId) {
    return { statusCode: 400, body: "No connection ID found." };
  }

  try {
    await docClient
      .delete({
        TableName: CONNECTIONS_TABLE,
        Key: { connectionId },
      })
      .promise();

    return { statusCode: 200, body: "Disconnected." };
  } catch (error) {
    console.error("Error deleting connection:", error);
    return { statusCode: 500, body: "Failed to disconnect." };
  }
};
