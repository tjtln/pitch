import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isValid } from "../handValidation";
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
  const location = useLocation();
  const { name, gameId } = location.state || {};
  const [hand, setHand] = useState<string[]>([]);
  const [playedCards, setPlayedCards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2", "Player 3", "Player 4"]);

  useEffect(() => {
    const fetchHand = async () => {
      try {
        const response = await axios.get<PlayerHand>(
          `https://zrxobwstga.execute-api.us-east-1.amazonaws.com/Prod/games/${gameId}/players/${name}/hand`
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

  const handleCardPlay = async (card: string) => {
    if(await isValid(card, gameId, name)){
      setHand((prevHand) => prevHand.filter((c) => c !== card));
    }
  };

  return (
    <div style={{ textAlign: "center", width: "100vw", height: "100vh", position: "relative" }}>
      {isLoading ? (
        <p>Loading your hand...</p>
      ) : (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {/* Table */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              height: "300px",
              backgroundColor: "green",
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3 style={{ color: "white" }}>Played Cards</h3>
            <div style={{ position: "relative", width: "80px", height: "120px" }}>
              {playedCards.map((card, index) => (
                <img
                  key={index}
                  src={cardImageUrl(card)}
                  alt={card}
                  style={{
                    position: "absolute",
                    top: `${index * 5}px`,
                    left: `${index * 5}px`,
                    width: "50px",
                    height: "75px",
                    zIndex: index,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Player Hands */}
          {players.map((player, index) => {
            const positions = [
              { top: "15%", left: "57%", transform: "translateX(-50%)" }, // Top
              { top: "50%", left: "85%", transform: "translateY(-50%)" }, // Right
              { top: "80%", left: "50%", transform: "translateX(-50%)" }, // Bottom (Your Hand)
              { top: "50%", left: "15%", transform: "translateY(-50%)" }, // Left
            ];

            const isSidePlayer = index === 1 || index === 3; // Right or Left players

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  ...positions[index],
                  display: "flex",
                  flexDirection: isSidePlayer ? "column" : "row",
                  alignItems: "center",
                }}
              >
                {index === 2 ? (
                  // Your Hand
                  <>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {hand.map((card, cardIndex) => (
                        <img
                          key={cardIndex}
                          src={cardImageUrl(card)}
                          alt={card}
                          style={{
                            width: "80px",
                            height: "120px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleCardPlay(card)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  // Other Players
                  <>
                    <div
                      style={{
                        position: "relative",
                        width: isSidePlayer ? "60px" : "400px",
                        height: isSidePlayer ? "200px" : "120px",
                      }}
                    >
                      {Array(13)
                        .fill("back")
                        .map((_, idx) => (
                          <img
                            key={idx}
                            src="/src/assets/cards/back.png"
                            alt="Card Back"
                            style={{
                              position: "absolute",
                              left: isSidePlayer ? undefined : `${idx * 10}px`,
                              top: isSidePlayer ? `${idx * 10}px` : undefined,
                              width: "40px",
                              height: "60px",
                              zIndex: idx,
                              transform: isSidePlayer ? "rotate(90deg)" : undefined,
                            }}
                          />
                        ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
      <button onClick={handleGoBack} style={{
                              position: "absolute",
                              left: '90%',
                              top: '10%',
                              width: "120px",
                              height: "60px",
                            }}>
        Back to Home
      </button>
    </div>
  );
};

export default GameScreen;
