// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBbFkFjS4dE1eecXZV8ubd6UkiOPlXznCA",
  authDomain: "tictactoe-27386.firebaseapp.com",
  projectId: "tictactoe-27386",
  storageBucket: "tictactoe-27386.appspot.com",
  messagingSenderId: "897904535320",
  appId: "1:897904535320:web:1e29f1225c9b262099606d",
  measurementId: "G-T588R6QBKN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
