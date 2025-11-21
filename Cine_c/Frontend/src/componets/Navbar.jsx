import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-yellow-500 p-2 rounded-lg transform group-hover:rotate-12 transition-transform">
              <span className="text-2xl">🎬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CineHonduras</h1>
              <p className="text-yellow-400 text-xs">Tu cine nacional</p>
            </div>
          </Link>

          {/* Menú de Navegación */}
          <div className="flex space-x-1 bg-gray-700 bg-opacity-50 rounded-2xl p-1">
            <Link 
              to="/cartelera" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                location.pathname === '/cartelera' 
                  ? 'bg-yellow-500 text-gray-900 shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              🎭 Cartelera
            </Link>
            <Link 
              to="/ventas" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                location.pathname === '/ventas' 
                  ? 'bg-yellow-500 text-gray-900 shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              📊 Reportes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;