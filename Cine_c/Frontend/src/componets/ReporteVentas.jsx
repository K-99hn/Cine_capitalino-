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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Generando reporte de ventas...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar reporte</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={cargarVentas}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!reporte) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay datos disponibles</h2>
        <p className="text-gray-600 mb-6">No se pudo cargar el reporte de ventas</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">📊 Reporte de Ventas</h1>
          <div className="bg-white rounded-2xl shadow-lg p-6 inline-block">
            <p className="text-2xl font-semibold text-gray-700">
              Fecha: <span className="text-green-600">{reporte.fecha}</span>
            </p>
          </div>
        </div>

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold mb-2">Total Entradas</h3>
            <p className="text-4xl font-bold">{reporte.resumen?.total_entradas || 0}</p>
            <p className="text-blue-100 mt-2">Entradas vendidas hoy</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl mb-4">💵</div>
            <h3 className="text-xl font-semibold mb-2">Ingresos Totales</h3>
            <p className="text-4xl font-bold">L. {reporte.resumen?.ingresos_totales || 0}</p>
            <p className="text-green-100 mt-2">En Lempiras</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Promedio por Compra</h3>
            <p className="text-4xl font-bold">L. {reporte.resumen?.promedio_por_compra || 0}</p>
            <p className="text-purple-100 mt-2">Ticket promedio</p>
          </div>
        </div>

        {/* Ventas por Película */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">🎬 Ventas por Película</h2>
          <p className="text-gray-600 text-center mb-8">Desempeño de cada película en taquilla</p>
          
          {reporte.por_pelicula && reporte.por_pelicula.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <tr>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Película</th>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Entradas Vendidas</th>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Ingresos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reporte.por_pelicula.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl mr-4">🎭</div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{item.titulo}</p>
                            <p className="text-gray-500 text-sm">Película en cartelera</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-lg font-semibold">
                          {item.entradas_vendidas}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-2xl font-bold text-green-600">L. {item.ingresos}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-6xl mb-4">😴</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay ventas por película</h3>
              <p className="text-gray-500">Aún no se han registrado ventas para hoy</p>
            </div>
          )}
        </div>

        {/* Ventas por Función */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">🕒 Ventas por Función</h2>
          <p className="text-gray-600 text-center mb-8">Desglose por horario y sala</p>
          
          {reporte.por_funcion && reporte.por_funcion.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white">
                  <tr>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Película</th>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Sala</th>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Hora</th>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Entradas</th>
                    <th className="px-8 py-4 text-left text-lg font-semibold uppercase tracking-wider">Ingresos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reporte.por_funcion.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 whitespace-nowrap text-lg font-semibold text-gray-900">
                        {item.titulo}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                          {item.sala}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-lg font-semibold text-gray-700">
                        🕒 {item.hora}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-xl font-bold text-blue-600">{item.entradas_vendidas}</span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-xl font-bold text-green-600">L. {item.ingresos}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay ventas por función</h3>
              <p className="text-gray-500">Las ventas se mostrarán por horario aquí</p>
            </div>
          )}
        </div>

        {/* Botón Actualizar */}
        <div className="text-center mt-12">
          <button 
            onClick={cargarVentas}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            🔄 Actualizar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReporteVentas;