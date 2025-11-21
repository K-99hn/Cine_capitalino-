const API_BASE_URL = 'http://localhost:5000/api';

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

    console.log(`📤 API Request: ${endpoint}`, {
      method: config.method || 'GET',
      body: config.body
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log(`📥 API Response: ${endpoint}`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Si no se puede parsear como JSON, usar el texto
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Solo intentamos parsear JSON si hay contenido
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    
    console.log(`✅ API Success: ${endpoint}`, data);
    return data;

  } catch (error) {
    console.error(`❌ API Request failed for ${endpoint}:`, error);
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