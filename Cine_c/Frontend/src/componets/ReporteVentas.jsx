import React, { useState, useEffect } from 'react';
import { ventasAPI } from '../services/api';

const ReporteVentas = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ventasAPI.getVentas();
      setReporte(data);
    } catch (err) {
      setError('Error al cargar el reporte de ventas');
      console.error('Error cargando ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando reporte...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!reporte) return <div className="error">No se pudo cargar el reporte</div>;

  return (
    <div className="reporte-ventas">
      <h2>📊 Reporte de Ventas - {reporte.fecha}</h2>
      
      <div className="resumen-general">
        <h3>Resumen del Día</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Entradas</h4>
            <p className="stat-number">{reporte.resumen?.total_entradas || 0}</p>
          </div>
          <div className="stat-card">
            <h4>Ingresos Totales</h4>
            <p className="stat-number">${reporte.resumen?.ingresos_totales || 0}</p>
          </div>
          <div className="stat-card">
            <h4>Promedio por Compra</h4>
            <p className="stat-number">${reporte.resumen?.promedio_por_compra || 0}</p>
          </div>
        </div>
      </div>

      <div className="ventas-por-pelicula">
        <h3>Ventas por Película</h3>
        {reporte.por_pelicula && reporte.por_pelicula.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Entradas Vendidas</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {reporte.por_pelicula.map((item, index) => (
                  <tr key={index}>
                    <td>{item.titulo}</td>
                    <td>{item.entradas_vendidas}</td>
                    <td>${item.ingresos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No hay ventas por película para mostrar</p>
        )}
      </div>

      <div className="ventas-por-funcion">
        <h3>Ventas por Función</h3>
        {reporte.por_funcion && reporte.por_funcion.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Sala</th>
                  <th>Hora</th>
                  <th>Entradas</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {reporte.por_funcion.map((item, index) => (
                  <tr key={index}>
                    <td>{item.titulo}</td>
                    <td>{item.sala}</td>
                    <td>{item.hora}</td>
                    <td>{item.entradas_vendidas}</td>
                    <td>${item.ingresos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No hay ventas por función para mostrar</p>
        )}
      </div>

      <button onClick={cargarVentas} className="btn btn-actualizar">
        Actualizar Reporte
      </button>
    </div>
  );
};

export default ReporteVentas;