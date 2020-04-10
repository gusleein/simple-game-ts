import React from 'react';
import logo from './logo.svg';
import './App.css';
import AsteroidsGame from "./components/AsteroidsGame"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AsteroidsGame />
      </header>
    </div>
  );
}

export default App;
