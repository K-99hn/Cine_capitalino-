const express = require('express');
const pool = require('../Config/database');
const router = express.Router();

// GET /api/peliculas/:id - Detalles de película
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const peliculaResult = await pool.query(
      'SELECT * FROM peliculas WHERE id = $1',
      [id]
    );

    if (peliculaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    // Obtener funciones para hoy
    const today = new Date().toISOString().split('T')[0];
    const funcionesResult = await pool.query(`
      SELECT 
        c.id as funcion_id,
        s.nombre as sala,
        s.tipo_sala,
        c.fecha,
        c.hora,
        c.precio
      FROM cartelera c
      JOIN salas s ON c.sala_id = s.id
      WHERE c.pelicula_id = $1 AND c.fecha = $2
      ORDER BY c.hora ASC
    `, [id, today]);

    res.json({
      ...peliculaResult.rows[0],
      funciones: funcionesResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;