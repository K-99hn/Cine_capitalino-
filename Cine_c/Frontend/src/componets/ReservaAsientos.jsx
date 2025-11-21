import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { reservasAPI, carteleraAPI } from "../services/api";
import { Ticket, Armchair, ArrowLeft, Monitor, Loader2, User, Mail, Calendar, Clock, MapPin, AlertCircle } from "lucide-react";

const ReservaAsientos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [funcion, setFuncion] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");


  useEffect(() => {

    let funcionId = id;
    if (!funcionId || funcionId === 'undefined') {
      const pathParts = location.pathname.split('/');
      funcionId = pathParts[pathParts.length - 1];
    }
    if (!funcionId || funcionId === 'undefined') {
      return;
    }
    cargarDatos(funcionId);
  }, [id, location]);
  const cargarDatos = async (funcionId) => {
    try {
      setLoading(true);
      setMensaje("");
      const carteleraData = await carteleraAPI.getCartelera();
      const funcionData = carteleraData.find(f =>
        f.funcion_id == funcionId || f.id == funcionId
      );
      if (!funcionData) {
        setMensaje("No se encontró la función solicitada");
        setLoading(false);
        return;
      }
      const asientosData = await reservasAPI.getAsientos(funcionId);
      setFuncion(funcionData);
      setAsientos(asientosData);
    } catch (err) {
      setMensaje("Error al cargar los datos: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleAsiento = (asiento) => {
    if (asiento.estado === 'ocupado') return;
    setSeleccionados((prev) => {
      const exists = prev.find(a => a.id === asiento.id);
      if (exists) {
        return prev.filter(a => a.id !== asiento.id);
      } else {
        return [...prev, asiento];
      }
    });
  };
  const hacerReserva = async () => {
    try {
      setEnviando(true);
      setMensaje("");
      if (seleccionados.length === 0) {
        setMensaje("Selecciona al menos un asiento.");
        return;
      }
      if (!clienteNombre.trim()) {
        setMensaje("Ingresa tu nombre para continuar.");
        return;
      }
      const funcionId = id || (location.pathname.split('/').pop());
      const resultado = await reservasAPI.postReserva({
        cartelera_id: funcionId,
        asientos: seleccionados,
        cliente_nombre: clienteNombre,
        cliente_email: clienteEmail
      });

      if (resultado.success) {
        setMensaje(`${resultado.message}`);
        setTimeout(() => {
          navigate('/cartelera');
        }, 2000);
      } else {
        setMensaje(`${resultado.error}`);
      }
    } catch (error) {
      setMensaje(` Error: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };
  const asientosPorFila = asientos.reduce((acc, asiento) => {
    if (!acc[asiento.fila]) {
      acc[asiento.fila] = [];
    }
    acc[asiento.fila].push(asiento);
    return acc;
  }, {});
  const total = seleccionados.length * (funcion?.precio ? parseFloat(funcion.precio) : 0);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-[#B20710] animate-spin mb-4" />
          <p className="text-gray-700 mt-4 text-lg">Cargando asientos......</p>
          <p className="text-gray-500 text-sm">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!funcion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Función no encontrada
          </h2>
          <p className="text-gray-600 mb-2">ID: {id}</p>
          <p className="text-gray-600 mb-4">{mensaje}</p>
          <Link
            to="/cartelera"
            className="bg-[#B20710] hover:bg-[#7F0004] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Volver a Cartelera
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="w-screen bg-gray-100 py-7 px-4">
      <div className="max-w-8x2 mx-auto">
        <div className="mb-8">
          <Link
            to="/cartelera"
            className="inline-flex items-center gap-2 bg-white shadow-lg px-4 py-3 rounded-xl hover:bg-gray-50 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver a Cartelera</span>
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Reserva de Asientos
                </h1>
                <p className="text-xl text-[#B20710] font-semibold mt-1">
                  {funcion.titulo}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{funcion.fecha}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{funcion.hora}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{funcion.sala} - {funcion.tipo_sala}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Tu Reserva</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Asientos:</span>
                  <span className="font-semibold">{seleccionados.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio c/u:</span>
                  <span className="font-semibold">L. {funcion.precio}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="text-gray-800 font-bold">Total:</span>
                  <span className="text-[#B20710] font-bold">L. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Tus Datos</h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-[#B20710] focus:border-transparent"
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={clienteEmail}
                    onChange={(e) => setClienteEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl  text-black focus:ring-2 focus:ring-[#B20710] focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
            </div>
            {seleccionados.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-500 mb-3">Asientos Elegidos</h3>
                <div className="flex flex-wrap gap-2">
                  {seleccionados.map(asiento => (
                    <span
                      key={asiento.id}
                      className="bg-[#B20710] px-3 py-1 rounded-lg font-medium"
                    >
                      {asiento.fila}{asiento.numero}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-[#B20710] text-white px-12 py-4 rounded-lg flex items-center gap-3 shadow-lg">
                  <Monitor className="w-6 h-6" />
                  <span className="font-bold tracking-widest text-lg">PANTALLA</span>
                </div>
              </div>
              {asientos.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No hay asientos disponibles</h3>
                  <p className="text-gray-500">No se pudieron cargar los asientos para esta función.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(asientosPorFila).map(([fila, asientosFila]) => (
                    <div key={fila} className="flex justify-center gap-1">
                      <div className="w-6 flex items-center justify-center font-bold text-gray-600">
                        {fila}
                      </div>
                      <div className="flex gap-0">
                        {asientosFila.map((asiento) => {
                          const seleccionado = seleccionados.find(a => a.id === asiento.id);

                          return (
                            <button
                              key={asiento.id}
                              onClick={() => toggleAsiento(asiento)}
                              disabled={asiento.estado === 'ocupado'}
                              className={`
                                w-12 h-12 flex items-center justify-center rounded-xl border-2 
                                transition-all duration-200 font-bold text-sm
                                ${asiento.estado === 'ocupado'
                                  ? "bg-gray-300 border-gray-400 text-gray-300 cursor-not-allowed"
                                  : seleccionado
                                    ? "bg-[#B20710] border-[#7F0004] text-red-400 shadow-lg transform scale-110"
                                    : "bg-green-300  hover:bg-green-600 text-green-400 hover:scale-105"
                                }
                              `}
                            >
                              {asiento.numero}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* LEYENDA */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span className="text-gray-600 text-sm">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#B20710] border-2 border-[#7F0004] rounded"></div>
                  <span className="text-gray-600 text-sm">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded"></div>
                  <span className="text-gray-600 text-sm">Ocupado</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              {mensaje && (
                <div className={`text-center p-4 rounded-xl mb-4 ${mensaje.includes("")
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                  }`}>
                  <p className="font-semibold">{mensaje}</p>
                </div>
              )}

              <button
                onClick={hacerReserva}
                disabled={enviando || seleccionados.length === 0 || !clienteNombre.trim() || asientos.length === 0}
                className="w-full bg-[#B20710] hover:bg-[#7F0004] disabled:bg-gray-400 disabled:cursor-not-allowed
                         text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl flex items-center
                         justify-center gap-3 transition-all duration-200"
              >
                <Ticket className="w-6 h-6" />
                {enviando ? "Procesando Reserva..." : `Confirmar Reserva - L. ${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaAsientos;