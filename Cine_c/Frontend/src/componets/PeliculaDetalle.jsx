import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carteleraAPI } from '../services/api';

const PeliculaDetalle = () => {
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPelicula = async () => {
      try {
        const data = await carteleraAPI.getPelicula(id);
        setPelicula(data);
      } catch (err) {
        console.error('Error al cargar película:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarPelicula();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando detalles de la película...</p>
      </div>
    </div>
  );

  if (!pelicula) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
      <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Película No Encontrada</h2>
        <p className="text-gray-600 mb-6">La película que buscas no está disponible.</p>
        <Link 
          to="/cartelera" 
          className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
        >
          Volver a Cartelera
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Botón volver */}
        <Link 
          to="/cartelera" 
          className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mb-8"
        >
          <span className="mr-2">←</span>
          Volver a Cartelera
        </Link>

        {/* Tarjeta principal de la película */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="md:flex">
            {/* Poster */}
            <div className="md:w-1/3">
              <img 
                src={pelicula.imagen_url} 
                alt={pelicula.titulo}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>
            
            {/* Información */}
            <div className="md:w-2/3 p-8">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    {pelicula.genero}
                  </span>
                  
                  <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                    {pelicula.titulo}
                  </h1>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {pelicula.descripcion}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <span className="text-2xl mr-3">🎭</span>
                      <div>
                        <p className="font-semibold">Director</p>
                        <p className="text-gray-600">{pelicula.director}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-2xl mr-3">⏱️</span>
                      <div>
                        <p className="font-semibold">Duración</p>
                        <p className="text-gray-600">{pelicula.duracion} minutos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Etiquetas */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                  <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    ⏱️ {pelicula.duracion} min
                  </span>
                  <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    🎭 {pelicula.genero}
                  </span>
                  <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    📋 {pelicula.clasificacion}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Funciones disponibles */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">🎟️ Funciones Disponibles</h2>
          <p className="text-gray-600 text-center mb-8">Selecciona tu función preferida</p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {pelicula.funciones && pelicula.funciones.map((funcion) => (
              <div key={funcion.funcion_id} className="border-2 border-gray-100 hover:border-purple-300 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">🕒 {funcion.hora}</h4>
                    <p className="text-gray-600 text-lg">Sala: <span className="font-semibold">{funcion.sala}</span></p>
                    <p className="text-gray-500">Tipo: {funcion.tipo_sala}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600 mb-1">L. {funcion.precio}</p>
                    <p className="text-sm text-gray-500">por persona</p>
                  </div>
                </div>
                
                <Link 
                  to={`/reservar/${funcion.funcion_id}`}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl block text-center"
                >
                  🎬 Seleccionar Asientos
                </Link>
              </div>
            ))}
          </div>

          {(!pelicula.funciones || pelicula.funciones.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😴</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay funciones disponibles</h3>
              <p className="text-gray-500">Vuelve más tarde para ver nuevas funciones</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeliculaDetalle;