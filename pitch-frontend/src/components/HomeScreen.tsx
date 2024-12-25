import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinGame, setIsJoinGame] = useState(false);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');

  const handleCreateGame = () => {
    setIsJoinGame(false);
    setIsModalOpen(true);
  };

  const handleJoinGame = () => {
    setIsJoinGame(true);
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    if (!name.trim() || (isJoinGame && !gameId.trim())) {
      alert('Please fill out all required fields.');
      return;
    }
  
    const state = { name, gameId: isJoinGame ? gameId : undefined };
  
    setIsModalOpen(false);
    navigate('/game', { state });
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false);
    setName('');
    setGameId('');
  };

  return (
    <div style={{ textAlign: 'center', width: '100vw', height: '100vh' }}>
      <h1>14 Point Pitch</h1>
      <p>By TJ Thielen</p>
      <button onClick={handleCreateGame} style={{ background: 'lightgray', margin: '10px' }}>
        Create Game
      </button>
      <button onClick={handleJoinGame} style={{ background: 'lightgray', margin: '10px' }}>
        Join Game
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              width: '300px',
            }}
          >
            <h2>{isJoinGame ? 'Join Game' : 'Create Game'}</h2>
            <div style={{ marginBottom: '10px' }}>
              <label>
                Your Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px',
                    marginTop: '5px',
                    borderRadius: '5px',
                    border: '1px solid lightgray',
                  }}
                />
              </label>
            </div>
            {isJoinGame && (
              <div style={{ marginBottom: '10px' }}>
                <label>
                  Game ID:
                  <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px',
                      marginTop: '5px',
                      borderRadius: '5px',
                      border: '1px solid lightgray',
                    }}
                  />
                </label>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                onClick={handleModalClose}
                style={{
                  background: 'lightgray',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                style={{
                  background: 'blue',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
