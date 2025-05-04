const fs = require('fs');
const path = require('path');
const db = require('./db/db');

const sql = fs.readFileSync(path.join(__dirname, '../db/users.sql'), 'utf8');

db.query(sql)
  .then(() => {
    console.log('✅ User table initialized.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Failed to init user table:', err.message);
    process.exit(1);
  });
