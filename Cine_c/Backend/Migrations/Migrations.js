const { Pool } = require('pg');
require('dotenv').config();

const Migrations = async () => {
  const adminPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres'
  });

  const appPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    console.log('🔧 Iniciando migraciones...');

    // 1. Crear base de datos si no existe
    try {
      await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('✅ Base de datos creada');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('✅ Base de datos ya existe');
      } else {
        throw err;
      }
    }

    // 2. Crear tabla peliculas
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS peliculas (
        id VARCHAR(10) PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        duracion VARCHAR(10),
        genero VARCHAR(100),
        director VARCHAR(255),
        clasificacion VARCHAR(50),
        imagen_url VARCHAR(500),
        activa VARCHAR(10) DEFAULT 'true',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla peliculas creada');

    // 3. Crear tabla salas
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS salas (
        id VARCHAR(10) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        capacidad VARCHAR(10) NOT NULL,
        tipo_sala VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla salas creada');

    // 4. Crear tabla cartelera
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS cartelera (
        id VARCHAR(10) PRIMARY KEY,
        pelicula_id VARCHAR(10),
        sala_id VARCHAR(10),
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        precio VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla cartelera creada');

    // 5. Crear tabla asientos
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS asientos (
        id VARCHAR(10) PRIMARY KEY,
        sala_id VARCHAR(10),
        fila VARCHAR(5) NOT NULL,
        numero VARCHAR(5) NOT NULL,
        tipo VARCHAR(50) DEFAULT 'normal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla asientos creada');

    // 6. Crear tabla compras
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS compras (
        id VARCHAR(50) PRIMARY KEY,
        cartelera_id VARCHAR(10),
        asiento_id VARCHAR(10),
        cliente_nombre VARCHAR(255) NOT NULL,
        cliente_email VARCHAR(255),
        cantidad VARCHAR(5) DEFAULT '1',
        total VARCHAR(10) NOT NULL,
        fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(50) DEFAULT 'confirmada'
      );
    `);
    console.log('✅ Tabla compras creada');

    console.log('🎉 Todas las migraciones ejecutadas correctamente');

  } catch (error) {
    console.error('❌ Error en migraciones:', error);
  } finally {
    await adminPool.end();
    await appPool.end();
  }
};

Migrations();