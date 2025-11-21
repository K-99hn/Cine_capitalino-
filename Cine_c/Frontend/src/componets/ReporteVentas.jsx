import React, { useState, useEffect } from "react";
import { ventasAPI } from "../services/api";
import {
  Film,
  Ticket,
  BarChart,
  DollarSign,
  RefreshCcw,
  Clock,
  TrendingUp,
  XCircle,
} from "lucide-react";

const ReporteVentas = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await ventasAPI.getVentas();
      setReporte(data);
    } catch (err) {
      setError("Error al cargar el reporte de ventas");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-16 w-16 border-b-4 border-[#B20710] rounded-full"></div>
          <p className="text-gray-700 mt-4 text-lg">Generando reporte...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-4">{error}</p>
          <button
            onClick={cargarVentas}
            className="bg-[#B20710] hover:bg-[#7F0004] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="w-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* TÍTULO */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#B20710] flex items-center justify-center gap-3">
            <BarChart className="w-10 h-10" /> Reporte de Ventas
          </h1>
          <div className="bg-white mt-4 px-6 py-3 rounded-xl shadow-md inline-block">
            <span className="text-gray-700 font-semibold">
              Fecha:{" "}
              <span className="text-[#B20710]">{reporte.fecha}</span>
            </span>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#B20710] text-white p-6 rounded-2xl shadow-xl">
            <Ticket className="w-10 h-10 mb-3" />
            <p className="text-xl font-semibold">Entradas Vendidas</p>
            <p className="text-4xl font-bold mt-2">
              {reporte.resumen?.total_entradas || 0}
            </p>
          </div>

          <div className="bg-[#7F0004] text-white p-6 rounded-2xl shadow-xl">
            <DollarSign className="w-10 h-10 mb-3" />
            <p className="text-xl font-semibold">Ingresos</p>
            <p className="text-4xl font-bold mt-2">
              L. {reporte.resumen?.ingresos_totales || 0}
            </p>
          </div>

          <div className="bg-black text-white p-6 rounded-2xl shadow-xl">
            <TrendingUp className="w-10 h-10 mb-3" />
            <p className="text-xl font-semibold">Promedio por Venta</p>
            <p className="text-4xl font-bold mt-2">
              L. {reporte.resumen?.promedio_por_compra || 0}
            </p>
          </div>
        </div>

        {/* TABLA PELÍCULAS */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-[#B20710] text-center mb-6">
            Ventas por Película
          </h2>

          {reporte.por_pelicula?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left">
                <thead className="bg-[#1A1A1A] text-white">
                  <tr>
                    <th className="px-6 py-4">Película</th>
                    <th className="px-6 py-4">Entradas</th>
                    <th className="px-6 py-4">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.por_pelicula.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 flex  text-black items-center gap-3">
                        <Film className="w-6 h-6 text-[#B20710]" />
                        {item.titulo}
                      </td>
                      <td className="px-6 py-4 text-black">{item.entradas_vendidas}</td>
                      <td className="px-6 py-4 text-[#B20710] font-bold">
                        L. {item.ingresos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-6">
              Sin ventas registradas.
            </p>
          )}
        </div>

        {/* BOTÓN ACTUALIZAR */}
        <div className="text-center mt-8">
          <button
            onClick={cargarVentas}
            className="flex items-center gap-3 mx-auto bg-[#B20710] hover:bg-[#7F0004] text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
          >
            <RefreshCcw className="w-6 h-6" /> Actualizar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReporteVentas;
