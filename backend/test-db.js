const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false // Required for Render PostgreSQL
  }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    pool.end();
  }
}

testConnection(); 