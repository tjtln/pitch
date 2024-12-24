import * as AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  const gameId = event.pathParameters?.gameId; // Extract gameId from path parameters
  if (!gameId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing gameId in path parameters" }),
    };
  }

  const body: { players: playersInput } = JSON.parse(event.body);
  const players = body.players;
  const hands: { [player: string]: any[] } = getHands(players);

  const params = {
    TableName: process.env.GAME_TABLE!,
    Key: { gameId },
    UpdateExpression: "SET hands = :hands",
    ExpressionAttributeValues: {
      ":hands": hands,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hands dealt successfully!",
        updatedGame: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error dealing hands:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to deal hands", error }),
    };
  }
};

function populateDeck(): string[] {
  const deck: string[] = [];
  for (let i = 1; i < 14; i++) {
    for (let j = 0; j < 4; j++) {
      let rank: string;
      switch (i) {
        case 1:
          rank = "A";
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          rank = `${i}`;
          break;
        case 11:
          rank = "J";
          break;
        case 12:
          rank = "Q";
          break;
        case 13:
          rank = "K";
          break;
        default:
          rank = "InvalidCard";
      }

      switch (j) {
        case 0:
          deck.push(`${rank}S`);
          break;
        case 1:
          deck.push(`${rank}C`);
          break;
        case 2:
          deck.push(`${rank}D`);
          break;
        case 3:
          deck.push(`${rank}H`);
          break;
      }
    }
  }
  deck.push('JkH');
  deck.push('JkL');

  return deck;
}

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getHands(players: playersInput): { [player: string]: any[] } {
  let deck: string[] = populateDeck();
  const hands: { [player: string]: any[] } = {};
  deck = shuffleArray(deck);
  hands[players[1]] = deck.splice(0, 13);
  hands[players[2]] = deck.splice(0, 14);
  hands[players[3]] = deck.splice(0, 14);
  hands[players[4]] = deck.splice(0, 13);
  return hands;
}

type playersInput = {
  1: string;
  2: string;
  3: string;
  4: string;
};
