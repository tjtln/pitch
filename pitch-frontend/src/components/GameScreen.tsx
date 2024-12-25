import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface PlayerHand {
  player: string;
  hand: string[];
}

const cardImageUrl = (card: string) => {
  return `/src/assets/cards/${card}.png`;
};


const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const [hand, setHand] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHand = async () => {
      try {
        const response = await axios.get<PlayerHand>(
          "https://zrxobwstga.execute-api.us-east-1.amazonaws.com/Prod/games/rj9m6cevi/players/TJ/hand"
        );
        setHand(response.data.hand);
      } catch (error) {
        console.error("Error fetching hand:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHand();
  }, []);

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", width: "100vw", height: "100vh" }}>
      <h1>Game Screen</h1>
      {isLoading ? (
        <p>Loading your hand...</p>
      ) : (
        <div>
          <h2>Your Hand</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            {hand.map((card, index) => (
              console.log('my card: ' + card) && 
              <img
                key={index}
                src={cardImageUrl(card)}
                alt={card}
                style={{ width: "80px", height: "120px" }}
              />
            ))}
          </div>

          <h2>Other Players</h2>
          <table style={{ margin: "20px auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Cards</th>
              </tr>
            </thead>
            <tbody>
              {["Player 1", "Player 2", "Player 3"].map((player, index) => (
                <tr key={index}>
                  <td>{player}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      {Array(13)
                        .fill("back")
                        .map((_, idx) => (
                          <img
                            key={idx}
                            src="/src/assets/cards/back.png"
                            alt="Card Back"
                            style={{ width: "40px", height: "60px" }}
                          />
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleGoBack} style={{ marginTop: "20px" }}>
        Back to Home
      </button>
    </div>
  );
};

export default GameScreen;
