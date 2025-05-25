const db = require('../db/db');
const crypto = require('crypto');

class Token {
  static async create(userId, tokenString, tokenType = 'access', expiresIn = '7d') {
    // Calculate expiration time
    const expirationTime = this.calculateExpiration(expiresIn);
    
    // Hash the token for security
    const tokenHash = crypto.createHash('sha256').update(tokenString).digest('hex');
    
    const query = `
      INSERT INTO tokens (user_id, token_hash, token_type, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [userId, tokenHash, tokenType, expirationTime]);
    return result.rows[0];
  }

  static async findByToken(tokenString) {
    const tokenHash = crypto.createHash('sha256').update(tokenString).digest('hex');
    
    const query = `
      SELECT t.*, u.id as user_id, u.name, u.email 
      FROM tokens t
      JOIN users u ON t.user_id = u.id
      WHERE t.token_hash = $1 
        AND t.expires_at > CURRENT_TIMESTAMP 
        AND t.is_revoked = FALSE
    `;
    
    const result = await db.query(query, [tokenHash]);
    return result.rows[0];
  }

  static async revokeToken(tokenString) {
    const tokenHash = crypto.createHash('sha256').update(tokenString).digest('hex');
    
    const query = `
      UPDATE tokens 
      SET is_revoked = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE token_hash = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [tokenHash]);
    return result.rows[0];
  }

  static async revokeAllUserTokens(userId) {
    const query = `
      UPDATE tokens 
      SET is_revoked = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_revoked = FALSE
      RETURNING *
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async cleanupExpiredTokens() {
    const query = `
      DELETE FROM tokens 
      WHERE expires_at < CURRENT_TIMESTAMP OR is_revoked = TRUE
    `;
    
    const result = await db.query(query);
    return result.rowCount;
  }

  static async getUserTokens(userId) {
    const query = `
      SELECT * FROM tokens 
      WHERE user_id = $1 
        AND expires_at > CURRENT_TIMESTAMP 
        AND is_revoked = FALSE
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static calculateExpiration(expiresIn) {
    const now = new Date();
    
    if (typeof expiresIn === 'string') {
      const unit = expiresIn.slice(-1);
      const value = parseInt(expiresIn.slice(0, -1));
      
      switch (unit) {
        case 's': // seconds
          return new Date(now.getTime() + value * 1000);
        case 'm': // minutes
          return new Date(now.getTime() + value * 60 * 1000);
        case 'h': // hours
          return new Date(now.getTime() + value * 60 * 60 * 1000);
        case 'd': // days
          return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
        default:
          throw new Error('Invalid expiration format. Use format like "7d", "24h", "60m", "3600s"');
      }
    }
    
    if (typeof expiresIn === 'number') {
      // Assume milliseconds
      return new Date(now.getTime() + expiresIn);
    }
    
    throw new Error('Invalid expiration format');
  }
}

module.exports = Token; 