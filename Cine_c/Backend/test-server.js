const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('🔧 Verificando importaciones...');

// Verificar cada ruta individualmente
try {
  const cartelera = require('./Routes/cartelera');
  console.log('✅ cartelera:', typeof cartelera);
  app.use('/api/cartelera', cartelera);
} catch (err) {
  console.log('❌ cartelera error:', err.message);
}

try {
  const peliculas = require('./Routes/peliculas');
  console.log('✅ peliculas:', typeof peliculas);
  app.use('/api/peliculas', peliculas);
} catch (err) {
  console.log('❌ peliculas error:', err.message);
}

try {
  const reservar = require('./Routes/reservar');
  console.log('✅ reservar:', typeof reservar);
  app.use('/api/reservar', reservar);
} catch (err) {
  console.log('❌ reservar error:', err.message);
}

console.log('🔧 Probando archivo ventas.js...');

try {
  const ventas = require('./Routes/ventas');
  console.log('✅ ventas cargado correctamente');
  console.log('Tipo:', typeof ventas);
  console.log('Es función?', typeof ventas === 'function');
} catch (err) {
  console.log('❌ Error:', err.message);
}

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});