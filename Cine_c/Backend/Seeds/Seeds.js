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

    // 1. Insertar películas (TODO como texto)
    await pool.query(`
      INSERT INTO peliculas (id, titulo, descripcion, duracion, genero, director, clasificacion, imagen_url) VALUES
      ('1', 'Avengers: Endgame', 'Los Vengadores se reúnen para enfrentar a Thanos en la batalla definitiva.', '181', 'Acción/Ciencia Ficción', 'Hermanos Russo', 'PG-13', 'https://cdn.marvel.com/content/2x/avengersendgame_lob_crd_05.jpg'),
      ('2', 'The Batman', 'Batman investiga la corrupción en Gotham City mientras enfrenta al Enigma.', '176', 'Acción/Crimen', 'Matt Reeves', 'PG-13', 'https://cdn.cinematerial.com/p/136x/fhfecufs/the-batman-movie-poster-sm.jpg?v=1645104442'),
      ('3', 'Spider-Man: No Way Home', 'Peter Parker busca ayuda del Doctor Strange para restaurar su identidad secreta.', '148', 'Acción/Aventura', 'Jon Watts', 'PG-13', 'https://i.pinimg.com/736x/17/7d/13/177d13f6c85aa600df3c774ad1cc5116.jpg'),
      ('4', 'Dune', 'Paul Atreides se embarca en una travesía épica en el planeta desértico de Arrakis.', '155', 'Ciencia Ficción', 'Denis Villeneuve', 'PG-13', 'https://www.commonsensemedia.org/sites/default/files/styles/ratio_2_3_medium/public/product-images/csm-movie/dune-movie-poster.jpeg');
    `);
    console.log('✅ Películas insertadas');

    // 2. Insertar salas (TODO como texto)
    await pool.query(`
      INSERT INTO salas (id, nombre, capacidad, tipo_sala) VALUES
      ('1', 'Sala 1 - Premium', '120', '4DX'),
      ('2', 'Sala 2 - Standard', '150', 'Normal'),
      ('3', 'Sala 3 - IMAX', '200', 'IMAX'),
      ('4', 'Sala 4 - Standard', '140', 'Normal');
    `);
    console.log('✅ Salas insertadas');

    // 3. Insertar cartelera (TODO como texto)
    const today = new Date().toISOString().split('T')[0];
    await pool.query(`
      INSERT INTO cartelera (id, pelicula_id, sala_id, fecha, hora, precio) VALUES
      ('1', '1', '1', $1, '14:00', '12.50'),
      ('2', '1', '2', $1, '17:30', '10.00'),
      ('3', '2', '3', $1, '15:00', '15.00'),
      ('4', '3', '4', $1, '16:00', '10.00'),
      ('5', '4', '1', $1, '20:00', '12.50'),
      ('6', '2', '2', $1, '21:00', '10.00');
    `, [today]);
    console.log('✅ Cartelera insertada');

    // 4. Insertar asientos (TODO como texto)
    const salas = await pool.query('SELECT id FROM salas');
    let asientoId = 1;
    
    for (let sala of salas.rows) {
      for (let fila = 'A'; fila <= 'J'; fila = String.fromCharCode(fila.charCodeAt(0) + 1)) {
        for (let numero = 1; numero <= 15; numero++) {
          await pool.query(
            'INSERT INTO asientos (id, sala_id, fila, numero) VALUES ($1, $2, $3, $4)',
            [asientoId.toString(), sala.id, fila, numero.toString()]
          );
          asientoId++;
        }
      }
      console.log(`✅ Asientos insertados para sala ${sala.id}`);
    }

    console.log('🎉 Todos los datos de ejemplo insertados correctamente');

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
  } finally {
    await pool.end();
  }
};

Seeds();