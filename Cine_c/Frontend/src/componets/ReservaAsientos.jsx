import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reservasAPI } from '../services/api';

const ReservaAsientos = () => {
  const { funcionId } = useParams();
  const navigate = useNavigate();
  const [asientos, setAsientos] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [precioFuncion, setPrecioFuncion] = useState(0);

  useEffect(() => {
    const cargarAsientos = async () => {
      try {
        const data = await reservasAPI.getAsientos(funcionId);
        setAsientos(data);
        
        // Obtener precio de la función
        const response = await fetch(`http://localhost:5000/api/cartelera`);
        const cartelera = await response.json();
        const funcion = cartelera.find(f => f.funcion_id === parseInt(funcionId));
        if (funcion) {
          setPrecioFuncion(parseInt(funcion.precio));
        }
      } catch (err) {
        console.error('Error al cargar asientos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarAsientos();
  }, [funcionId]);

  const toggleAsiento = (asiento) => {
    if (asiento.estado === 'ocupado') return;

    setAsientosSeleccionados(prev => {
      const exists = prev.find(a => a.id === asiento.id);
      if (exists) {
        return prev.filter(a => a.id !== asiento.id);
      } else {
        return [...prev, asiento];
      }
    });
  };

  const handleReserva = async () => {
    if (asientosSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un asiento');
      return;
    }

    if (!cliente.nombre.trim()) {
      alert('Por favor ingresa tu nombre completo');
      return;
    }

    try {
      const reservaData = {
        cartelera_id: parseInt(funcionId),
        asientos: asientosSeleccionados,
        cliente_nombre: cliente.nombre,
        cliente_email: cliente.email
      };

      const data = await reservasAPI.postReserva(reservaData);
      
      if (data.success) {
        alert(`✅ ${data.message}\nTotal: L. ${data.total}`);
        navigate('/cartelera');
      }
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  const renderSala = () => {
    const filas = [...new Set(asientos.map(a => a.fila))].sort();
    
    return (
      <div className="text-center">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 rounded-2xl mb-8 text-2xl font-bold shadow-2xl">
          🎬 PANTALLA PRINCIPAL
        </div>
        
        <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-8 shadow-2xl">
          {filas.map(fila => (
            <div key={fila} className="flex items-center gap-3">
              <span className="w-8 font-bold text-gray-700 text-lg">{fila}</span>
              {asientos
                .filter(a => a.fila === fila)
                .sort((a, b) => a.numero - b.numero)
                .map(asiento => (
                  <button
                    key={asiento.id}
                    className={`w-12 h-12 rounded-xl text-base font-bold transition-all duration-200 transform hover:scale-110 shadow-lg ${
                      asiento.estado === 'ocupado' 
                        ? 'bg-red-500 text-white cursor-not-allowed shadow-red-500/50' 
                        : asientosSeleccionados.find(a => a.id === asiento.id) 
                        ? 'bg-yellow-500 text-white shadow-yellow-500/50 scale-110' 
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/50'
                    }`}
                    onClick={() => toggleAsiento(asiento)}
                    disabled={asiento.estado === 'ocupado'}
                  >
                    {asiento.numero}
                  </button>
                ))}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-8 mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg shadow-lg"></div>
            <span className="font-semibold text-gray-700">Disponible</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg shadow-lg"></div>
            <span className="font-semibold text-gray-700">Seleccionado</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg shadow-lg"></div>
            <span className="font-semibold text-gray-700">Ocupado</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando diseño de la sala...</p>
      </div>
    </div>
  );

  const total = asientosSeleccionados.length * precioFuncion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 text-center">🎟️ Selecciona tus Asientos</h2>
        <p className="text-gray-600 text-center mb-8 text-lg">Elige tus lugares preferidos para una experiencia única</p>
        
        {/* Sala de Cine */}
        <div className="mb-12">
          {renderSala()}
        </div>

        {/* Información de Reserva */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">📝 Información de Reserva</h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">Nombre Completo *</label>
                <input
                  type="text"
                  value={cliente.nombre}
                  onChange={(e) => setCliente({...cliente, nombre: e.target.value})}
                  placeholder="Ingresa tu nombre completo"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">Email (Opcional)</label>
                <input
                  type="email"
                  value={cliente.email}
                  onChange={(e) => setCliente({...cliente, email: e.target.value})}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                />
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-blue-100">
              <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">📦 Resumen de Compra</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold">Asientos seleccionados:</span>
                  <span className="text-gray-800 font-bold">
                    {asientosSeleccionados.map(a => `${a.fila}${a.numero}`).join(', ') || 'Ninguno'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold">Cantidad de entradas:</span>
                  <span className="text-blue-600 font-bold text-xl">{asientosSeleccionados.length}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold">Precio unitario:</span>
                  <span className="text-green-600 font-bold">L. {precioFuncion}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <span className="text-2xl font-bold text-gray-800">Total a pagar:</span>
                  <span className="text-3xl font-bold text-green-600">L. {total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de confirmación */}
          <button 
            className={`w-full mt-8 py-5 px-6 rounded-2xl text-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-2xl ${
              asientosSeleccionados.length === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-500/50'
            }`}
            onClick={handleReserva}
            disabled={asientosSeleccionados.length === 0}
          >
            {asientosSeleccionados.length === 0 
              ? 'Selecciona al menos un asiento' 
              : `🎬 Confirmar Reserva - L. ${total}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservaAsientos;