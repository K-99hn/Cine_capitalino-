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

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return data;

  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
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