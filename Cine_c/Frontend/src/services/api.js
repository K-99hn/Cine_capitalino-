const API_BASE_URL = 'http://localhost:5000/api';

// Función genérica para hacer requests
async function apiRequest(endpoint, options = {}) {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Si hay body, lo convertimos a JSON
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    console.log('📤 Enviando request a:', `${API_BASE_URL}${endpoint}`);
    console.log('Datos:', config.body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export const carteleraAPI = {
  getCartelera: () => apiRequest('/cartelera'),
  getPelicula: (id) => apiRequest(`/peliculas/${id}`),
};

export const reservasAPI = {
  getAsientos: (carteleraId) => apiRequest(`/reservar/asientos/${carteleraId}`),
  postReserva: (data) => apiRequest('/reservar', {
    method: 'POST',
    body: data,
  }),
};

export const ventasAPI = {
  getVentas: () => apiRequest('/ventas'),
};
// ← ESTA LÍNEA DEBE ESTAR AL FINAL Y NO HABER NADA DESPUÉS