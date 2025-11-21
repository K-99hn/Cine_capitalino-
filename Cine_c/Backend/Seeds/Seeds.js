const { Pool } = require('pg');
require('dotenv').config();

const Seeds = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    console.log('🌱 Insertando datos de ejemplo...');

    // 🔄 LIMPIAR TABLAS EXISTENTES PRIMERO (en orden por dependencias)
    console.log('🧹 Limpiando tablas existentes...');
    await pool.query('DELETE FROM compras;');
    await pool.query('DELETE FROM asientos;');
    await pool.query('DELETE FROM cartelera;');
    await pool.query('DELETE FROM salas;');
    await pool.query('DELETE FROM peliculas;');
    console.log('✅ Tablas limpiadas');

    // 1. Insertar películas con imágenes reales y precios en Lempiras
    await pool.query(`
      INSERT INTO peliculas (id, titulo, descripcion, duracion, genero, director, clasificacion, imagen_url) VALUES
      ('1', 'Avengers: Endgame', 'Los Vengadores se reúnen para enfrentar a Thanos en la batalla definitiva.', '181', 'Acción/Ciencia Ficción', 'Hermanos Russo', 'PG-13', 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=300&h=400&fit=crop'),
      ('2', 'The Batman', 'Batman investiga la corrupción en Gotham City mientras enfrenta al Enigma.', '176', 'Acción/Crimen', 'Matt Reeves', 'PG-13', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop'),
      ('3', 'Spider-Man: No Way Home', 'Peter Parker busca ayuda del Doctor Strange para restaurar su identidad secreta.', '148', 'Acción/Aventura', 'Jon Watts', 'PG-13', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop'),
      ('4', 'Dune', 'Paul Atreides se embarca en una travesía épica en el planeta desértico de Arrakis.', '155', 'Ciencia Ficción', 'Denis Villeneuve', 'PG-13', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop'),
      ('5', 'Jurassic World', 'Los dinosaurios escapan y causan el caos en un parque temático moderno.', '124', 'Aventura/Ciencia Ficción', 'Colin Trevorrow', 'PG-13', 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=300&h=400&fit=crop'),
      ('6', 'The Flash', 'Barry Allen viaja en el tiempo para cambiar eventos del pasado.', '144', 'Acción/Aventura', 'Andy Muschietti', 'PG-13', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop');
    `);
    console.log('✅ 6 Películas insertadas');

    // 2. Insertar salas
    await pool.query(`
      INSERT INTO salas (id, nombre, capacidad, tipo_sala) VALUES
      ('1', 'Sala Premium 4DX', '120', '4DX'),
      ('2', 'Sala Estándar', '150', 'Normal'),
      ('3', 'Sala IMAX', '200', 'IMAX'),
      ('4', 'Sala Familiar', '140', 'Normal'),
      ('5', 'Sala VIP', '80', 'VIP');
    `);
    console.log('✅ 5 Salas insertadas');

    // 3. Insertar cartelera con PRECIOS EN LEMPIRAS y fechas actuales
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    console.log('📅 Insertando funciones para:', todayStr);

    await pool.query(`
      INSERT INTO cartelera (id, pelicula_id, sala_id, fecha, hora, precio) VALUES
      -- Funciones para HOY - Precios en Lempiras
      ('1', '1', '1', $1, '14:00', '250'),    -- 4DX: L. 250
      ('2', '1', '2', $1, '17:30', '180'),    -- Normal: L. 180
      ('3', '2', '3', $1, '15:00', '300'),    -- IMAX: L. 300
      ('4', '3', '4', $1, '16:00', '160'),    -- Familiar: L. 160
      ('5', '4', '1', $1, '20:00', '250'),    -- 4DX: L. 250
      ('6', '2', '2', $1, '21:00', '180'),    -- Normal: L. 180
      ('7', '5', '3', $1, '18:00', '300'),    -- IMAX: L. 300
      ('8', '6', '5', $1, '19:30', '350'),    -- VIP: L. 350
      
      -- Funciones para MAÑANA
      ('9', '1', '1', $2, '16:00', '250'),
      ('10', '3', '2', $2, '20:00', '180'),
      ('11', '4', '3', $2, '18:30', '300'),
      ('12', '6', '5', $2, '21:00', '350');
    `, [todayStr, tomorrowStr]);
    console.log('✅ Cartelera insertada con precios en Lempiras');

    // 4. Insertar asientos para cada sala
    const salas = await pool.query('SELECT id FROM salas');
    let asientoId = 1;
    
    for (let sala of salas.rows) {
      // Determinar número de filas según capacidad
      let filas, asientosPorFila;
      if (sala.id === '1') { // Sala Premium - 120 asientos
        filas = 10; asientosPorFila = 12;
      } else if (sala.id === '2') { // Standard - 150 asientos
        filas = 10; asientosPorFila = 15;
      } else if (sala.id === '3') { // IMAX - 200 asientos
        filas = 10; asientosPorFila = 20;
      } else if (sala.id === '4') { // Familiar - 140 asientos
        filas = 10; asientosPorFila = 14;
      } else { // VIP - 80 asientos
        filas = 8; asientosPorFila = 10;
      }
      
      for (let fila = 0; fila < filas; fila++) {
        const letraFila = String.fromCharCode(65 + fila); // A, B, C, etc.
        for (let numero = 1; numero <= asientosPorFila; numero++) {
          await pool.query(
            'INSERT INTO asientos (id, sala_id, fila, numero) VALUES ($1, $2, $3, $4)',
            [asientoId.toString(), sala.id, letraFila, numero.toString()]
          );
          asientoId++;
        }
      }
      console.log(`✅ ${filas * asientosPorFila} asientos insertados para ${sala.id}`);
    }

    console.log('🎉 Todos los datos de ejemplo insertados correctamente');
    console.log('💵 Precios en Lempiras:');
    console.log('   • Normal: L. 180');
    console.log('   • 4DX: L. 250');
    console.log('   • IMAX: L. 300');
    console.log('   • VIP: L. 350');
    console.log('   • Familiar: L. 160');

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
  } finally {
    await pool.end();
  }
};

Seeds();