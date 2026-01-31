const pool = require("../db/pool");

class AdminRepository {
  // Find admin by username
  async findByUsername(username) {
    const query = "SELECT * FROM admins WHERE username = $1";
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  // Find admin by id
  async findById(id) {
    const query = "SELECT * FROM admins WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Create a new admin
  async createAdmin(username, passwordHash) {
    const query = `
      INSERT INTO admins (username, password_hash, is_active)
      VALUES ($1, $2, true)
      RETURNING id, username, created_at, is_active
    `;
    const result = await pool.query(query, [username, passwordHash]);
    return result.rows[0];
  }

  // Update admin active status
  async updateActiveStatus(id, isActive) {
    const query = "UPDATE admins SET is_active = $1 WHERE id = $2 RETURNING *";
    const result = await pool.query(query, [isActive, id]);
    return result.rows[0];
  }
}

module.exports = new AdminRepository();
