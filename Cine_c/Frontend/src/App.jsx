import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componets/Navbar';
import Cartelera from './componets/Cartelera';
import PeliculaDetalle from './componets/PeliculaDetalle';
import ReservaAsientos from './componets/ReservaAsientos';
import ReporteVentas from './componets/ReporteVentas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Cartelera />} />
            <Route path="/cartelera" element={<Cartelera />} />
            <Route path="/pelicula/:id" element={<PeliculaDetalle />} />
            <Route path="/reservar/:funcionId" element={<ReservaAsientos />} />
            <Route path="/ventas" element={<ReporteVentas />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
