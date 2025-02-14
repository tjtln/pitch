import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Received unknown route:", JSON.stringify(event));

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Unknown WebSocket route" }),
  };
};
