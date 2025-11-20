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

  useEffect(() => {
    const cargarAsientos = async () => {
      try {
        const data = await reservasAPI.getAsientos(funcionId);
        setAsientos(data);
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
      alert('Selecciona al menos un asiento');
      return;
    }

    if (!cliente.nombre.trim()) {
      alert('Ingresa tu nombre');
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
        alert(`✅ ${data.message}\nTotal: $${data.total}`);
        navigate('/cartelera');
      }
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  const renderSala = () => {
    const filas = [...new Set(asientos.map(a => a.fila))].sort();
    
    return (
      <div className="sala-container">
        <div className="pantalla">🎬 PANTALLA</div>
        <div className="asientos-grid">
          {filas.map(fila => (
            <div key={fila} className="fila">
              <span className="fila-label">{fila}</span>
              {asientos
                .filter(a => a.fila === fila)
                .sort((a, b) => a.numero - b.numero)
                .map(asiento => (
                  <button
                    key={asiento.id}
                    className={`asiento ${
                      asiento.estado === 'ocupado' ? 'ocupado' :
                      asientosSeleccionados.find(a => a.id === asiento.id) ? 'seleccionado' : 'disponible'
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
        
        <div className="leyenda">
          <div className="leyenda-item">
            <div className="asiento disponible"></div>
            <span>Disponible</span>
          </div>
          <div className="leyenda-item">
            <div className="asiento seleccionado"></div>
            <span>Seleccionado</span>
          </div>
          <div className="leyenda-item">
            <div className="asiento ocupado"></div>
            <span>Ocupado</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Cargando asientos...</div>;

  return (
    <div className="reserva-container">
      <h2>🎟️ Selecciona tus Asientos</h2>
      
      {renderSala()}

      <div className="reserva-info">
        <h3>Información de Reserva</h3>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={cliente.nombre}
            onChange={(e) => setCliente({...cliente, nombre: e.target.value})}
            placeholder="Tu nombre completo"
          />
        </div>
        <div className="form-group">
          <label>Email (opcional):</label>
          <input
            type="email"
            value={cliente.email}
            onChange={(e) => setCliente({...cliente, email: e.target.value})}
            placeholder="tu@email.com"
          />
        </div>

        <div className="resumen">
          <h4>Resumen:</h4>
          <p>Asientos seleccionados: {asientosSeleccionados.map(a => `${a.fila}${a.numero}`).join(', ') || 'Ninguno'}</p>
          <p>Cantidad: {asientosSeleccionados.length}</p>
          <p>Total estimado: ${asientosSeleccionados.length * 10}</p>
        </div>

        <button 
          className="btn btn-confirmar"
          onClick={handleReserva}
          disabled={asientosSeleccionados.length === 0}
        >
          Confirmar Reserva (${asientosSeleccionados.length * 10})
        </button>
      </div>
    </div>
  );
};

export default ReservaAsientos;