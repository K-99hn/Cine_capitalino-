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
    // ELIMINAR EN ORDEN CORRECTO (por dependencias)
    await pool.query('DELETE FROM compras;');
    await pool.query('DELETE FROM asientos;');
    await pool.query('DELETE FROM cartelera;');
    await pool.query('DELETE FROM salas;');
    await pool.query('DELETE FROM peliculas;');

    // INSERTAR PELÍCULAS
    await pool.query(`INSERT INTO peliculas (id, titulo, descripcion, duracion, genero, director, clasificacion, imagen_url) VALUES
      ('1', 'Avengers: Endgame', 'Los Vengadores se reúnen para enfrentar a Thanos en la batalla definitiva.', '181', 'Acción/Ciencia Ficción', 'Hermanos Russo', 'PG-13', 'https://cdn.marvel.com/content/2x/avengersendgame_lob_crd_05.jpg'),
      ('2', 'The Batman', 'Batman investiga la corrupción en Gotham City mientras enfrenta al Enigma.', '176', 'Acción/Crimen', 'Matt Reeves', 'PG-13', 'https://media-cache.cinematerial.com/p/500x/oc7ouhfd/the-batman-movie-poster.jpg?v=1645121616'),
      ('3', 'Spider-Man: No Way Home', 'Peter Parker busca ayuda del Doctor Strange para restaurar su identidad secreta.', '148', 'Acción/Aventura', 'Jon Watts', 'PG-13', 'https://i.pinimg.com/736x/17/7d/13/177d13f6c85aa600df3c774ad1cc5116.jpg'),
      ('4', 'Dune', 'Paul Atreides se embarca en una travesía épica en el planeta desértico de Arrakis.', '155', 'Ciencia Ficción', 'Denis Villeneuve', 'PG-13', 'https://i.pinimg.com/736x/0c/d7/27/0cd727eef33af1d228a91e6c92a7e849.jpg'),
      ('5', 'Jurassic World', 'Los dinosaurios escapan y causan el caos en un parque temático moderno.', '124', 'Aventura/Ciencia Ficción', 'Colin Trevorrow', 'PG-13', 'https://media-cache.cinematerial.com/p/500x/1rymmw69/jurassic-world-movie-poster.jpg?v=1456377826'),
      ('6', 'The Flash', 'Barry Allen viaja en el tiempo para cambiar eventos del pasado.', '144', 'Acción/Aventura', 'Andy Muschietti', 'PG-13', 'https://media-cache.cinematerial.com/p/500x/7mut7hxy/the-flash-british-movie-poster.jpg?v=1687994161');
    `);

    // INSERTAR SALAS
    await pool.query(`
      INSERT INTO salas (id, nombre, capacidad, tipo_sala) VALUES
      ('1', 'Sala Premium 4DX', '120', '4DX'),
      ('2', 'Sala Estándar', '150', 'Normal'),
      ('3', 'Sala IMAX', '200', 'IMAX'),
      ('4', 'Sala Familiar', '140', 'Normal'),
      ('5', 'Sala VIP', '80', 'VIP');
    `);

    // INSERTAR CARTELERA
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

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

    // INSERTAR ASIENTOS
    const salas = await pool.query('SELECT id FROM salas');
    let asientoId = 1;
    
    for (let sala of salas.rows) {
      let filas, asientosPorFila;
      
      // Configuración por tipo de sala
      switch(sala.id) {
        case '1': // 4DX
          filas = 10; asientosPorFila = 12; break;
        case '2': // Estándar
          filas = 10; asientosPorFila = 15; break;
        case '3': // IMAX
          filas = 10; asientosPorFila = 20; break;
        case '4': // Familiar
          filas = 10; asientosPorFila = 14; break;
        case '5': // VIP
          filas = 8; asientosPorFila = 10; break;
        default:
          filas = 10; asientosPorFila = 15;
      }
      
      for (let fila = 0; fila < filas; fila++) {
        const letraFila = String.fromCharCode(65 + fila);
        for (let numero = 1; numero <= asientosPorFila; numero++) {
          await pool.query(
            'INSERT INTO asientos (id, sala_id, fila, numero) VALUES ($1, $2, $3, $4)',
            [asientoId.toString(), sala.id, letraFila, numero.toString()]
          );
          asientoId++;
        }
      }
    }

    console.log('✅ Datos de prueba insertados correctamente');

  } catch (error) {
    console.error('Error insertando datos:', error);
  } finally {
    await pool.end();
  }
};

Seeds();