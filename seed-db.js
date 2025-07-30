const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mvp_payments',
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conectado exitosamente');

    const hashedSecret = await bcrypt.hash('admin-secret-key', 10);
    
    console.log('🌱 Ejecutando seed...');
    await client.query(`
      INSERT INTO clients (client_id, hashed_secret, role, is_active) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (client_id) DO NOTHING
    `, ['admin-client', hashedSecret, 'admin', true]);
    
    console.log('✅ Seed ejecutado exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

seedDatabase(); 