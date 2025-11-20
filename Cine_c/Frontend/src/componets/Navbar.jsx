import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">🎬 CinePlus</h1>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/cartelera" 
              className={`nav-link ${location.pathname === '/cartelera' ? 'active' : ''}`}
            >
              Cartelera
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/ventas" 
              className={`nav-link ${location.pathname === '/ventas' ? 'active' : ''}`}
            >
              Reportes
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;