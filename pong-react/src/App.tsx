import React from 'react';
import './App.css';
import { BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Game from './game/game';
import Home from './home/home';


function App() {
  return (
  <BrowserRouter>
      <Routes>

        <Route path='/' element={<Home/>} />
        <Route path='/game' element={<Game/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
