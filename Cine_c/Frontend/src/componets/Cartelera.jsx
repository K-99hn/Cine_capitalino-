import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carteleraAPI } from '../services/api';

const Cartelera = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCartelera = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await carteleraAPI.getCartelera();
        setPeliculas(data);
      } catch (err) {
        setError('Error al cargar la cartelera');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarCartelera();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando cartelera...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-96">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">❌</div>
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!peliculas || peliculas.length === 0) return (
    <div className="flex justify-center items-center min-h-96">
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">🎭</div>
        <p className="text-gray-500 text-xl">No hay películas en cartelera para hoy</p>
        <p className="text-gray-400 mt-2">Vuelve mañana para ver nuevas funciones</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎬 Cartelera del Día
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre las mejores películas en nuestros cines. 
            <span className="text-blue-600 font-semibold"> ¡Reserva tus entradas ahora!</span>
          </p>
        </div>

        {/* Grid de Películas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {peliculas.map((pelicula) => (
            <div key={pelicula.funcion_id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
              {/* Imagen con overlay */}
              <div className="relative overflow-hidden">
                <img 
                  src={pelicula.imagen_url} 
                  alt={pelicula.titulo}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {pelicula.tipo_sala}
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                  {pelicula.duracion} min
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
                  {pelicula.titulo}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <span className="text-sm">{pelicula.genero}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{pelicula.clasificacion}</span>
                </div>

                {/* Información de función */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-gray-700">
                      <span className="text-lg">🕒</span>
                      <span className="ml-2 font-semibold">{pelicula.hora}</span>
                    </div>
                    <div className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                      {pelicula.sala}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Precio por persona</span>
                    <span className="text-2xl font-bold text-green-600">
                      L. {pelicula.precio}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-3">
                  <Link 
                    to={`/pelicula/${pelicula.funcion_id}`} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Ver Detalles
                  </Link>
                  <Link 
                    to={`/reservar/${pelicula.funcion_id}`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-3 px-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer informativo */}
        <div className="text-center mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">💫 Experiencia Cinematográfica Única</h3>
          <div className="grid md:grid-cols-3 gap-6 text-gray-600">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold mb-2">Asientos Preferenciales</h4>
              <p className="text-sm">Selecciona tu asiento ideal en tiempo real</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold mb-2">Reserva Rápida</h4>
              <p className="text-sm">Proceso de compra seguro y en minutos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🎁</div>
              <h4 className="font-semibold mb-2">Precios Hondureños</h4>
              <p className="text-sm">Precios accesibles en Lempiras</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartelera;