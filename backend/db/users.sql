const db = require('../db/db'); // ✅ 改成這樣
const bcrypt = require('bcrypt');

const User = {
  async create(name, email, password) {
    const hash = await bcrypt.hash(password, 10);
    const res = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hash]
    );
    return res.rows[0];
  },

  async findByEmail(email) {
    const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  }
};

module.exports = User;
