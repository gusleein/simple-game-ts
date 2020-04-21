import React from 'react';
import logo from './logo.svg';
import './App.css';
import AsteroidsGame from "./components/AsteroidsGame"
import TheGame from './components/AsteroidsGame/lib/TheGame'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TheGame />
      </header>
    </div>
  );
}

export default App;
