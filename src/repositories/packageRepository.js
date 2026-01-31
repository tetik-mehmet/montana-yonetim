const pool = require("../db/pool");

class PackageRepository {
  // Get all active packages
  async findAll() {
    const query =
      "SELECT * FROM membership_packages WHERE is_active = true ORDER BY duration_in_days";
    const result = await pool.query(query);
    return result.rows;
  }

  // Find package by id
  async findById(id) {
    const query = "SELECT * FROM membership_packages WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Create a new package
  async create(packageData) {
    const { name, durationInDays, price } = packageData;
    const query = `
      INSERT INTO membership_packages (name, duration_in_days, price, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING *
    `;
    const result = await pool.query(query, [name, durationInDays, price]);
    return result.rows[0];
  }

  // Update package (price and duration)
  async update(id, packageData) {
    const { name, durationInDays, price } = packageData;
    const query = `
      UPDATE membership_packages
      SET name = $1, duration_in_days = $2, price = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [name, durationInDays, price, id]);
    return result.rows[0];
  }

  // Deactivate package
  async deactivate(id) {
    const query =
      "UPDATE membership_packages SET is_active = false WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = new PackageRepository();
