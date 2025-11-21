import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Ticket, BarChart3 } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const active =
    "bg-[#B20710] text-white shadow-lg font-semibold hover:bg-[#7F0004]";
  const inactive =
    "text-gray-300 hover:bg-gray-700 hover:text-white transition";

  return (
    <nav className="bg-[#0A0A0A] shadow-lg sticky top-0 z-50 max-w-full">
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center space-x-3 group select-none"
          >
            <div className="bg-[#B20710] p-2 rounded-lg transform group-hover:scale-110 transition">
              <Film className="text-white w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                Cine Cipital
              </h1>
              <p className="text-[#B20710] text-xs sm:text-sm hidden sm:block">
                Tu cine 5 estrellas
              </p>
            </div>
          </Link>

          {/* MENÚ */}
          <div className="flex space-x-1 bg-gray-800/60 backdrop-blur-sm p-1 rounded-xl sm:rounded-2xl">

            <Link
              to="/cartelera"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm ${
                location.pathname === "/cartelera" ? active : inactive
              }`}
            >
              <Ticket className="w-4 h-4" />
              Cartelera
            </Link>

            <Link
              to="/ventas"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm ${
                location.pathname === "/ventas" ? active : inactive
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Reportes
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
