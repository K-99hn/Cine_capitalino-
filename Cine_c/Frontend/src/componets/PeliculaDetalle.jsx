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

  if (loading) return <div className="loading">Cargando...</div>;
  if (!pelicula) return <div className="error">Película no encontrada</div>;

  return (
    <div className="pelicula-detalle">
      <div className="detalle-header">
        <img 
          src={pelicula.imagen_url || '/placeholder-movie.jpg'} 
          alt={pelicula.titulo}
          className="detalle-imagen"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x600?text=No+Imagen';
          }}
        />
        <div className="detalle-info">
          <h1>{pelicula.titulo}</h1>
          <p className="director">Director: {pelicula.director}</p>
          <p className="descripcion">{pelicula.descripcion}</p>
          <div className="metadatos">
            <span className="tag">⏱️ {pelicula.duracion} min</span>
            <span className="tag">🎭 {pelicula.genero}</span>
            <span className="tag">📋 {pelicula.clasificacion}</span>
          </div>
        </div>
      </div>

      <div className="funciones-section">
        <h2>🎟️ Funciones Disponibles</h2>
        <div className="funciones-list">
          {pelicula.funciones && pelicula.funciones.map((funcion) => (
            <div key={funcion.funcion_id} className="funcion-card">
              <div className="funcion-info">
                <h4>🕒 {funcion.hora}</h4>
                <p>Sala: {funcion.sala} ({funcion.tipo_sala})</p>
                <p>Precio: ${funcion.precio}</p>
                <p>Asientos disponibles: {funcion.asientos_disponibles}</p>
              </div>
              <Link 
                to={`/reservar/${funcion.funcion_id}`}
                className="btn btn-reservar"
              >
                Seleccionar Asientos
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Link to="/cartelera" className="btn btn-volver">
        ← Volver a Cartelera
      </Link>
    </div>
  );
};

export default PeliculaDetalle;