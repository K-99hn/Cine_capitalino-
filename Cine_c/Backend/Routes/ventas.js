const express = require('express');
const pool = require('../Config/database');
const router = express.Router();

// GET /api/ventas - Reporte de ventas del día
router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Ventas totales
    const ventasResult = await pool.query(`
      SELECT 
        COUNT(*) as total_entradas,
        SUM(CAST(total AS DECIMAL)) as ingresos_totales,
        AVG(CAST(total AS DECIMAL)) as promedio_por_compra
      FROM compras 
      WHERE DATE(fecha_compra) = $1
    `, [today]);

    // Ventas por película
    const porPeliculaResult = await pool.query(`
      SELECT 
        p.titulo,
        COUNT(c.id) as entradas_vendidas,
        SUM(CAST(c.total AS DECIMAL)) as ingresos
      FROM compras c
      JOIN cartelera ca ON c.cartelera_id = ca.id
      JOIN peliculas p ON ca.pelicula_id = p.id
      WHERE DATE(c.fecha_compra) = $1
      GROUP BY p.titulo
      ORDER BY ingresos DESC
    `, [today]);

    res.json({
      fecha: today,
      resumen: ventasResult.rows[0],
      por_pelicula: porPeliculaResult.rows
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ESTA LÍNEA ES CRÍTICA - debe ser EXACTAMENTE así:
module.exports = router;