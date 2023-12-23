import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import './TicTacToe.css'; // Ensure you have this CSS file for styling

const TicTacToe = () => {
  const navigate = useNavigate();
  const { roomCode: initialRoomCode } = useParams();
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [newRoomCode, setNewRoomCode] = useState('');
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (roomCode) {
      const roomRef = firebase.database().ref(`rooms/${roomCode}`);
      roomRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && Array.isArray(data.gameState)) {
          setGameState(data.gameState);
          setCurrentTurn(data.currentTurn);
          setWinner(data.winner);
        }
      });

      return () => roomRef.off();
    }
  }, [roomCode]);

  const handleCellClick = (index) => {
    if (gameState[index] || winner || roomCode === undefined) return;

    const newGameState = [...gameState];
    newGameState[index] = currentTurn;

    const newWinner = checkWinner(newGameState);
    const nextTurnPlayer = currentTurn === 'X' ? 'O' : 'X';

    const roomRef = firebase.database().ref(`rooms/${roomCode}`);
    roomRef.update({
      gameState: newGameState,
      currentTurn: newWinner ? null : nextTurnPlayer,
      winner: newWinner,
    });
  };

  const checkWinner = (gameState) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        return gameState[a];
      }
    }
    return null;
  };

  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleCellClick(index)}>
        {gameState[index]}
      </button>
    );
  };

  const resetGame = () => {
    const roomRef = firebase.database().ref(`rooms/${roomCode}`);
    roomRef.update({
      gameState: Array(9).fill(null),
      currentTurn: 'X',
      winner: null,
    });
  };

  const handleRoomChange = () => {
    navigate(`/game/${newRoomCode}`);
    setRoomCode(newRoomCode);
  };

  return (
    <div className="game">
      <div className="room-info">
        <p>Current Room: {roomCode}</p>
        <input 
          type="text" 
          value={newRoomCode} 
          onChange={(e) => setNewRoomCode(e.target.value)} 
          placeholder="Enter new room code" 
        />
        <button onClick={handleRoomChange}>Join New Room</button>
      </div>
      <div className="board">
        {Array.from({ length: 9 }).map((_, index) => renderCell(index))}
      </div>
      {winner && <div className="winner">Winner: {winner}</div>}
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default TicTacToe;
