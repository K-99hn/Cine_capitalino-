import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { carteleraAPI } from "../services/api";
import {
  ArrowLeft,
  Film,
  Clock,
  User,
  Tag,
  Ticket,
  XCircle,
  Info,
} from "lucide-react";

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
        console.error("Error al cargar película:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPelicula();
  }, [id]);

  // LOADING
  if (loading)
    return (
      <div className=" bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-16 w-16 border-b-4 border-[#B20710] rounded-full"></div>
          <p className="text-gray-700 mt-4 text-lg">Cargando película...</p>
        </div>
      </div>
    );

  // NO DATA
  if (!pelicula)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-xl shadow-xl max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Película no encontrada
          </h2>
          <Link
            to="/cartelera"
            className="bg-[#B20710] hover:bg-[#7F0004] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Volver a Cartelera
          </Link>
        </div>
      </div>
    );

  return (
    <div className="w-screen bg-gray-100 p">
      <div className="max-w-6xl mx-auto px-4">

        {/* BOTÓN VOLVER */}
        <Link
          to="/cartelera"
          className="inline-flex items-center gap-2 bg-white shadow px-5 py-2 rounded-xl hover:bg-gray-100 transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </Link>

        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
          <div className="md:flex">
            
            {/* POSTER */}
            <div className="md:w-1/3">
              <img
                src={pelicula.imagen_url}
                alt={pelicula.titulo}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="md:w-2/3 p-8">
              <span className="inline-flex items-center gap-2 bg-[#B20710] text-white px-4 py-1 rounded-full font-semibold mb-4">
                <Tag className="w-4 h-4" />
                {pelicula.genero}
              </span>

              <h1 className="text-4xl font-bold text-[#0A0A0A] leading-tight mb-4">
                {pelicula.titulo}
              </h1>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {pelicula.descripcion}
              </p>

              {/* INFO EXTRA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

                {/* Director */}
                <div className="flex items-center gap-4">
                  <User className="w-8 h-8 text-[#B20710]" />
                  <div>
                    <p className="font-semibold text-gray-800">Director</p>
                    <p className="text-gray-600">{pelicula.director}</p>
                  </div>
                </div>

                {/* Duración */}
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-[#B20710]" />
                  <div>
                    <p className="font-semibold text-gray-800">Duración</p>
                    <p className="text-gray-600">{pelicula.duracion} minutos</p>
                  </div>
                </div>
              </div>

              {/* ETIQUETAS */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  <Clock className="w-4 h-4" /> {pelicula.duracion} min
                </span>

                <span className="inline-flex items-center gap-2 bg-[#B20710]/10 text-[#B20710] px-4 py-2 rounded-full text-sm">
                  <Film className="w-4 h-4" /> {pelicula.genero}
                </span>

                <span className="inline-flex items-center gap-2 bg-black/10 text-black px-4 py-2 rounded-full text-sm">
                  <Info className="w-4 h-4" /> {pelicula.clasificacion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FUNCIONES */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-[#B20710] text-center mb-2">
            Funciones Disponibles
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Selecciona tu función preferida
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {pelicula.funciones?.map((f) => (
              <div
                key={f.funcion_id}
                className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
                      <Clock className="w-6 h-6 text-[#B20710]" />
                      {f.hora}
                    </h4>
                    <p className="text-gray-600">
                      Sala: <span className="font-semibold">{f.sala}</span>
                    </p>
                    <p className="text-gray-500">{f.tipo_sala}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      L. {f.precio}
                    </p>
                    <p className="text-sm text-gray-500">por persona</p>
                  </div>
                </div>

                <Link
                  to={`/reservar/${f.funcion_id}`}
                  className="w-full bg-[#B20710] hover:bg-[#7F0004] text-white font-bold py-3 px-6 rounded-xl text-center shadow-lg transition block"
                >
                  <Ticket className="inline w-5 h-5 mr-2" />
                  Seleccionar Asientos
                </Link>
              </div>
            ))}
          </div>

          {(!pelicula.funciones || pelicula.funciones.length === 0) && (
            <div className="text-center py-12 text-gray-600">
              No hay funciones disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeliculaDetalle;
