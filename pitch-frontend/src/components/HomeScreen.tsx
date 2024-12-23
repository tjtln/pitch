import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateGame = () => {
    // Add logic to create a game here
    navigate('/game');
  };

  const handleJoinGame = () => {
    // Add logic to join a game here
    navigate('/game');
  }

  return (
    <div style={{ textAlign: 'center', width: '100vw', height: '100vh'}}>
      <h1>14 Point Pitch</h1>
      <p>By TJ Thielen</p>
      <button onClick={handleCreateGame} style={{ background: 'lightgray', margin: '10px' }}>
        Create Game
      </button>
      <button onClick={handleJoinGame} style={{ background: 'lightgray', margin: '10px' }}>
        Join Game
      </button>
    </div>
  );
};

export default HomeScreen;
