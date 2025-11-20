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

  if (loading) return <div className="loading">Cargando cartelera...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cartelera">
      <h2>🎭 Cartelera del Día</h2>
      <div className="peliculas-grid">
        {peliculas.map((pelicula) => (
          <div key={pelicula.funcion_id} className="pelicula-card">
            <img 
              src={pelicula.imagen_url || '/placeholder-movie.jpg'} 
              alt={pelicula.titulo}
              className="pelicula-imagen"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Imagen';
              }}
            />
            <div className="pelicula-info">
              <h3>{pelicula.titulo}</h3>
              <p className="genero">{pelicula.genero}</p>
              <p className="duracion">Duración: {pelicula.duracion} min</p>
              <p className="clasificacion">Clasificación: {pelicula.clasificacion}</p>
              <p className="funcion">
                🕒 {pelicula.hora} - {pelicula.sala} ({pelicula.tipo_sala})
              </p>
              <p className="precio">💰 ${pelicula.precio}</p>
              
              <div className="acciones">
                <Link 
                  to={`/pelicula/${pelicula.funcion_id}`} 
                  className="btn btn-info"
                >
                  Ver Detalles
                </Link>
                <Link 
                  to={`/reservar/${pelicula.funcion_id}`}
                  className="btn btn-reservar"
                >
                  Reservar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cartelera;