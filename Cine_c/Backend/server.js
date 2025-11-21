const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas - USAR Routes CON MAYÚSCULA
const carteleraRoutes = require('./Routes/cartelera');
const peliculasRoutes = require('./Routes/peliculas');
const reservarRoutes = require('./Routes/reservar');
const ventasRoutes = require('./Routes/ventas');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use('/api/cartelera', carteleraRoutes);
app.use('/api/peliculas', peliculasRoutes);
app.use('/api/reservar', reservarRoutes);
app.use('/api/ventas', ventasRoutes);

app.get('/', (req, res) => {
  res.json({ 
    endpoints: {
      cartelera: '/api/cartelera',
      peliculas: '/api/peliculas/:id', 
      reservar: '/api/reservar',
      ventas: '/api/ventas'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de cine ejecutándose`);
});