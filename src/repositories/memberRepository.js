const pool = require("../db/pool");

class MemberRepository {
  // Get all members
  async findAll() {
    const query = "SELECT * FROM members ORDER BY created_at DESC";
    const result = await pool.query(query);
    return result.rows;
  }

  // Find member by id
  async findById(id) {
    const query = "SELECT * FROM members WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Create a new member
  async create(memberData) {
    const { firstName, lastName, email } = memberData;
    const query = `
      INSERT INTO members (first_name, last_name, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [firstName, lastName, email]);
    return result.rows[0];
  }

  // Update member
  async update(id, memberData) {
    const { firstName, lastName, email } = memberData;
    const query = `
      UPDATE members
      SET first_name = $1, last_name = $2, email = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [firstName, lastName, email, id]);
    return result.rows[0];
  }

  // Delete member
  async delete(id) {
    const query = "DELETE FROM members WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Check if email exists
  async emailExists(email, excludeId = null) {
    let query = "SELECT id FROM members WHERE email = $1";
    const params = [email];

    if (excludeId) {
      query += " AND id != $2";
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }
}

module.exports = new MemberRepository();
