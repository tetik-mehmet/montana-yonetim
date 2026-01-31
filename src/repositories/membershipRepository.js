const pool = require("../db/pool");

class MembershipRepository {
  // Get all memberships with member and package details
  async findAll() {
    const query = `
      SELECT 
        mm.*,
        m.first_name,
        m.last_name,
        m.email,
        mp.name as package_name,
        mp.duration_in_days,
        mp.price
      FROM member_memberships mm
      JOIN members m ON mm.member_id = m.id
      JOIN membership_packages mp ON mm.package_id = mp.id
      ORDER BY mm.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Find memberships by member id
  async findByMemberId(memberId) {
    const query = `
      SELECT 
        mm.*,
        mp.name as package_name,
        mp.duration_in_days,
        mp.price
      FROM member_memberships mm
      JOIN membership_packages mp ON mm.package_id = mp.id
      WHERE mm.member_id = $1
      ORDER BY mm.start_date DESC
    `;
    const result = await pool.query(query, [memberId]);
    return result.rows;
  }

  // Find active membership for a member
  async findActiveMembership(memberId) {
    const query = `
      SELECT 
        mm.*,
        mp.name as package_name,
        mp.duration_in_days,
        mp.price
      FROM member_memberships mm
      JOIN membership_packages mp ON mm.package_id = mp.id
      WHERE mm.member_id = $1 AND mm.status = 'active'
      LIMIT 1
    `;
    const result = await pool.query(query, [memberId]);
    return result.rows[0];
  }

  // Get active memberships
  async findActive() {
    const query = `
      SELECT 
        mm.*,
        m.first_name,
        m.last_name,
        m.email,
        mp.name as package_name,
        mp.duration_in_days,
        mp.price
      FROM member_memberships mm
      JOIN members m ON mm.member_id = m.id
      JOIN membership_packages mp ON mm.package_id = mp.id
      WHERE mm.status = 'active'
      ORDER BY mm.end_date
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get expired memberships
  async findExpired() {
    const query = `
      SELECT 
        mm.*,
        m.first_name,
        m.last_name,
        m.email,
        mp.name as package_name,
        mp.duration_in_days,
        mp.price
      FROM member_memberships mm
      JOIN members m ON mm.member_id = m.id
      JOIN membership_packages mp ON mm.package_id = mp.id
      WHERE mm.status = 'expired'
      ORDER BY mm.end_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Find memberships that should be expired (end_date < today and status = active)
  async findShouldBeExpired() {
    const query = `
      SELECT * FROM member_memberships
      WHERE end_date < CURRENT_DATE AND status = 'active'
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Create a new membership
  async create(membershipData) {
    const { memberId, packageId, startDate, endDate, status } = membershipData;
    const query = `
      INSERT INTO member_memberships (member_id, package_id, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      memberId,
      packageId,
      startDate,
      endDate,
      status,
    ]);
    return result.rows[0];
  }

  // Update membership status
  async updateStatus(id, status) {
    const query =
      "UPDATE member_memberships SET status = $1 WHERE id = $2 RETURNING *";
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  // Cancel all active memberships for a member
  async cancelActiveMemberships(memberId) {
    const query = `
      UPDATE member_memberships
      SET status = 'cancelled'
      WHERE member_id = $1 AND status = 'active'
      RETURNING *
    `;
    const result = await pool.query(query, [memberId]);
    return result.rows;
  }
}

module.exports = new MembershipRepository();
