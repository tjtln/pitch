import * as AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  const body: {players: playersInput} = JSON.parse(event.body);
  const players = body.players;
  const hands: {[player: string]: any[]} = getHands(players);
  const putRequests = Object.entries(hands).map(([player, hand]) => ({
    PutRequest: {
      Item: {
        player,
        hand,
        createdAt: new Date().toISOString(),
      },
    },
  }));

  const params = {
    RequestItems: {
      [process.env.HANDS_TABLE ?? "undefined table"]: putRequests,
    },
  };

  try {
    await dynamoDB.batchWrite(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hands dealt successfully!" }),
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
          rank = "UhhThisIsntACard";
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
  deck.push('JH');
  deck.push('JL');

  return deck;
}

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getHands(players: playersInput): { [player: string]: any[]; } {
  let deck: string[] = populateDeck();
  const hands: { [player: string]: any[]; } = {};
  deck = shuffleArray(deck);
  hands[players[1]] = deck.splice(0, 13);
  hands[players[2]] = deck.splice(0, 14);
  hands[players[3]] = deck.splice(0, 14);
  hands[players[4]] = deck.splice(0, 13);
  return hands;
}

type playersInput = {
  1: string,
  2: string,
  3: string,
  4: string
}