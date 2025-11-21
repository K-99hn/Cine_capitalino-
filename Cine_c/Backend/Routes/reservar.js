const express = require('express');
const pool = require('../Config/database');
const router = express.Router();

// GET /api/reservar/asientos/:cartelera_id - Obtener asientos
router.get('/asientos/:cartelera_id', async (req, res) => {
  try {
    const { cartelera_id } = req.params;

    const result = await pool.query(`
      SELECT 
        a.id,
        a.fila,
        a.numero,
        a.tipo,
        CASE WHEN c.id IS NULL THEN 'disponible' ELSE 'ocupado' END as estado
      FROM asientos a
      JOIN cartelera ca ON a.sala_id = ca.sala_id
      LEFT JOIN compras c ON c.asiento_id = a.id AND c.cartelera_id = ca.id
      WHERE ca.id = $1
      ORDER BY a.fila, a.numero
    `, [cartelera_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reservar - Hacer reserva
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { cartelera_id, asientos, cliente_nombre, cliente_email } = req.body;
    

    await client.query('BEGIN');

    for (let asiento of asientos) {
      const disponibilidad = await client.query(
        'SELECT 1 FROM compras WHERE cartelera_id = $1 AND asiento_id = $2',
        [cartelera_id, asiento.id]
      );

      if (disponibilidad.rows.length > 0) {
        throw new Error(`El asiento ${asiento.fila}${asiento.numero} ya está ocupado`);
      }
    }

    const funcionResult = await client.query(
      'SELECT precio FROM cartelera WHERE id = $1',
      [cartelera_id]
    );

    if (funcionResult.rows.length === 0) {
      throw new Error('Función no encontrada');
    }

    const precioUnitario = parseFloat(funcionResult.rows[0].precio);
    const total = precioUnitario * asientos.length;

    // Crear compras - GENERAR ID para cada compra
    let compraIndex = 1;
    for (let asiento of asientos) {
      const compraId = `compra_${Date.now()}_${compraIndex}`;
      
      await client.query(
        `INSERT INTO compras (id, cartelera_id, asiento_id, cliente_nombre, cliente_email, cantidad, total)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          compraId,                    
          cartelera_id, 
          asiento.id, 
          cliente_nombre, 
          cliente_email || '', 
          '1', 
          total.toString()
        ]
      );
      compraIndex++;
    }

    await client.query('COMMIT');

    res.json({ 
      success: true, 
      message: `Reserva confirmada para ${asientos.length} asiento(s)`,
      total: total,
      asientos: asientos.map(a => `${a.fila}${a.numero}`)
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en reserva:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    client.release();
  }
});

module.exports = router;