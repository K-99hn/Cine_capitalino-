import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carteleraAPI } from '../services/api';
import {
  Film,
  Clock,
  Calendar,
  MapPin,
  Ticket,
  Loader2,
  AlertCircle,
  Clapperboard,
  Star,
  Zap,
  HandCoins,
} from "lucide-react";

const Cartelera = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCartelera = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await carteleraAPI.getCartelera(); // ✅ Corregido
        console.log('Datos de cartelera:', data); // Para debug
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

  // LOADING
  if (loading)
    return (
      <div className="max-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-[#B20710] animate-spin mb-4" />
          <p className="text-gray-700 text-lg font-medium">Cargando cartelera...</p>
        </div>
      </div>
    );

  // ERROR
  if (error)
    return (
      <div className="max-h-full flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error al cargar
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#B20710] hover:bg-[#7F0004] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  // NO DATA
  if (!peliculas || peliculas.length === 0)
    return (
      <div className="W-screen flex items-center justify-center bg-gray-100 ">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md text-center">
          <Film className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No hay películas hoy
          </h2>
          <p className="text-gray-600 mb-6">
            Vuelve mañana para ver nuevas funciones
          </p>
          <div className="text-yellow-500 flex justify-center">
            <Star className="w-6 h-6" fill="currentColor" />
            <Star className="w-6 h-6" fill="currentColor" />
            <Star className="w-6 h-6" fill="currentColor" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white shadow-lg px-6 py-3 rounded-2xl mb-6">
            <Film className="w-8 h-8 text-[#B20710]" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Cartelera del Día
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre las mejores películas en nuestros cines
          </p>
        </div>

        {/* GRID DE PELÍCULAS */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {peliculas.map((pelicula) => (
            <div 
              key={pelicula.funcion_id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-gray-200"
            >
              
              {/* IMAGEN */}
              <div className="relative overflow-hidden">
                <img 
                  src={pelicula.imagen_url} 
                  alt={pelicula.titulo}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* BADGE TIPO SALA */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    pelicula.tipo_sala === 'IMAX' ? 'bg-purple-600' :
                    pelicula.tipo_sala === '4DX' ? 'bg-red-600' :
                    pelicula.tipo_sala === 'VIP' ? 'bg-yellow-600' :
                    'bg-blue-600'
                  }`}>
                    {pelicula.tipo_sala}
                  </span>
                </div>

                {/* OVERLAY INFO */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{pelicula.duracion} min</span>
                    <span className="mx-1">•</span>
                    <span>{pelicula.clasificacion}</span>
                  </div>
                </div>
              </div>

              {/* CONTENIDO */}
              <div className="p-5">
                
                {/* TÍTULO Y GÉNERO */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-[#B20710] transition-colors">
                  {pelicula.titulo}
                </h3>
                
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded-md">
                    {pelicula.genero}
                  </span>
                </div>

                {/* INFORMACIÓN DE FUNCIÓN */}
                <div className="space-y-3 mb-4">
                  
                  {/* HORA Y SALA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-[#B20710]" />
                      <span className="font-semibold">{pelicula.hora}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{pelicula.sala}</span>
                    </div>
                  </div>

                  {/* PRECIO */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-sm">Precio</span>
                    <span className="text-2xl font-bold text-green-600">
                      L. {pelicula.precio}
                    </span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex flex-col gap-2">
                  {/* VER DETALLES - usa pelicula_id o id de película */}
                  <Link 
                    to={`/pelicula/${pelicula.id || pelicula.pelicula_id}`} 
                    className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-xl transition-all duration-200 font-semibold text-sm group/btn"
                  >
                    <Film className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Ver Detalles
                  </Link>
                  
                  {/* RESERVAR - usa funcion_id */}
                  <Link
                    to={`/reservar/${pelicula.funcion_id}`}
                    onClick={(e) => {
                      console.log('Navegando a reserva con ID:', pelicula.funcion_id);
                      if (!pelicula.funcion_id) {
                        e.preventDefault();
                        console.error('Error: funcion_id no disponible');
                      }
                    }}
                    className="flex items-center justify-center gap-2 bg-[#B20710] hover:bg-[#7F0004] text-white py-3 px-4 rounded-xl transition-all duration-200 font-semibold text-sm group/btn"
                  >
                    <Ticket className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER INFORMATIVO */}
        <div className="text-center mt-16 bg-white rounded-3xl shadow-xl p-8 md:p-12 mx-4">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Experiencia Cinematográfica Única
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Disfruta del mejor cine con tecnología de punta, sonido envolvente y 
            comodidad excepcional en cada una de nuestras salas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-gray-600">
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50">
              <div className="text-3xl mb-3"> <Clapperboard /></div>
              <h4 className="font-semibold mb-2 text-gray-800">Asientos Preferenciales</h4>
              <p className="text-sm text-center">Selecciona tu asiento ideal en tiempo real</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50">
              <div className="text-3xl mb-3"><Zap/></div>
              <h4 className="font-semibold mb-2 text-gray-800">Reserva Rápida</h4>
              <p className="text-sm text-center">Proceso de compra seguro y en minutos</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50">
              <div className="text-3xl mb-3"><HandCoins/></div>
              <h4 className="font-semibold mb-2 text-gray-800">Precios unicos </h4>
              <p className="text-sm text-center">Precios accesibles para todos</p>
            </div>
          </div>
        </div>

        {/* CONTADOR DE PELÍCULAS */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-white shadow-lg px-6 py-3 rounded-2xl">
            <Calendar className="w-5 h-5 text-[#B20710]" />
            <span className="text-gray-700 font-semibold">
              {peliculas.length} película{peliculas.length !== 1 ? 's' : ''} en cartelera hoy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartelera;