import React from 'react';
import logo from './logo.svg';
import './App.css';
import {SimpleGame} from "./components/SimpleGame"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SimpleGame />
      </header>
    </div>
  );
}

export default App;
