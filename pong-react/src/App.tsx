import React from 'react';
import './App.css';
import { BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Game from './game/game';
import Home from './home/home';
import Bot_game from './game/bot_game';


function App() {
  return (
  <BrowserRouter>
      <Routes>

        <Route path='/' element={<Home/>} />
        <Route path='/game' element={<Game/>} />
        <Route path='/vbot' element={<Bot_game/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
