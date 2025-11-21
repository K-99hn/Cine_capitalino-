const express = require('express');
const pool = require('../Config/database');
const router = express.Router();

// GET /api/cartelera - Cartelera del día
router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await pool.query(`
      SELECT 
        c.id as funcion_id,
        p.id as pelicula_id,  
        p.titulo,
        p.descripcion,
        p.duracion,
        p.genero,
        p.clasificacion,
        p.imagen_url,
        s.nombre as sala,
        s.tipo_sala,
        c.fecha,
        c.hora,
        c.precio
      FROM cartelera c
      JOIN peliculas p ON c.pelicula_id = p.id
      JOIN salas s ON c.sala_id = s.id
      WHERE c.fecha = $1
      ORDER BY c.hora ASC
    `, [today]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;