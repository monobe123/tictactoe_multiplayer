// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import LobbyPage from './GameLobbyPage';
import TicTacToe from './TicTacToe';
import './App.css';

function App() {
  return (
    <AuthProvider> {/* Wrap your routes in AuthProvider */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/signupPage" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/gamelobbypage" element={<LobbyPage />} />
            <Route path="/game/:roomCode" element={<TicTacToe />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
