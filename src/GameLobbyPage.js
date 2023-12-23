import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useAuth } from './AuthContext'; // Import useAuth
import TicTacToe from './TicTacToe';
import './GamingLobbyPage.css'; 

const firebaseConfig = {
  apiKey: "AIzaSyBbFkFjS4dE1eecXZV8ubd6UkiOPlXznCA",
  authDomain: "tictactoe-27386.firebaseapp.com",
  projectId: "tictactoe-27386",
  storageBucket: "tictactoe-27386.appspot.com",
  messagingSenderId: "897904535320",
  appId: "1:897904535320:web:1e29f1225c9b262099606d",
  measurementId: "G-T588R6QBKN"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

const GameLobbyPage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  const [roomCode, setRoomCode] = useState('');
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (roomCode && userId) {
      const roomRef = database.ref('rooms/' + roomCode);
      roomRef.on('value', (snapshot) => {
        const room = snapshot.val();
        if (room && room.player1 && room.player2) {
          setInGame(true);
          setWaitingForPlayer(false);
        } else {
          setWaitingForPlayer(true);
        }
      });

      return () => roomRef.off();
    }
  }, [userId, roomCode]);

  const createRoom = () => {
    if (!userId) {
      console.error("Cannot create room: userId is undefined");
      setErrorMessage("Unable to create room. Please try logging in again.");
      return;
    }

    const newRoomCode = Math.random().toString(36).substring(2, 7);
    const roomRef = database.ref('rooms/' + newRoomCode);
    roomRef.set({
      player1: userId,
      gameState: Array(9).fill(null),
      currentTurn: 'player1'
    }).catch((error) => {
      console.error("Error creating room:", error);
      setErrorMessage("Failed to create room. Please try again.");
    });
    setRoomCode(newRoomCode);
  };

  const joinRoom = () => {
    if (!userId) {
      console.error("Cannot join room: userId is undefined");
      setErrorMessage("Unable to join room. Please try logging in again.");
      return;
    }

    const roomRef = database.ref('rooms/' + roomCode);
    roomRef.once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          roomRef.child('player2').set(userId)
            .then(() => {
              setInGame(true);
              setErrorMessage('');
            })
            .catch((error) => {
              console.error("Error joining room:", error);
              setErrorMessage("Failed to join room. Please try again.");
            });
        } else {
          setErrorMessage('Room not found');
        }
      })
      .catch((error) => {
        console.error("Error fetching room data:", error);
        setErrorMessage("Failed to fetch room data. Please try again.");
      });
  };

  return (
    <div>
      {!inGame ? (
        <>
          <button onClick={createRoom}>Create Room</button>
          <input type="text" value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="Enter Room Code" />
          <button onClick={joinRoom}>Join Room</button>
          {waitingForPlayer && <p>Waiting for the second player...</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </>
      ) : (
        <TicTacToe roomCode={roomCode} userId={userId} />
        // Replace this with your game component when inGame is true
      )}
    </div>
  );
};

export default GameLobbyPage;