import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', width: '100vw', height: '100vh'}}>
      <h1>Game Screen</h1>
      <p>This is where your card game will be implemented!</p>
      <button onClick={handleGoBack} style={{ marginTop: '20px' }}>
        Back to Home
      </button>
    </div>
  );
};

export default GameScreen;
