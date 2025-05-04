const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',  // Docker 內用 "db"，本機測試用 "localhost"
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'example',
  database: process.env.DB_NAME || 'mistake_db',
  port: 5432,
});

module.exports = pool;
