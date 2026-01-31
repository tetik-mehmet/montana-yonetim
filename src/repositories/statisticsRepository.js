const pool = require("../db/pool");

class StatisticsRepository {
  // Toplam üye sayısı
  async getTotalMembers() {
    const result = await pool.query("SELECT COUNT(*) as count FROM members");
    return parseInt(result.rows[0].count);
  }

  // Aktif üyelik sayısı
  async getActiveMemberships() {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM member_memberships WHERE status = 'active'",
    );
    return parseInt(result.rows[0].count);
  }

  // Süresi dolmuş üyelik sayısı
  async getExpiredMemberships() {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM member_memberships WHERE status = 'expired'",
    );
    return parseInt(result.rows[0].count);
  }

  // İptal edilmiş üyelik sayısı
  async getCancelledMemberships() {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM member_memberships WHERE status = 'cancelled'",
    );
    return parseInt(result.rows[0].count);
  }

  // Paketlere göre üyelik dağılımı
  async getMembershipsByPackage() {
    const result = await pool.query(`
      SELECT 
        mp.name as package_name,
        COUNT(mm.id) as count
      FROM membership_packages mp
      LEFT JOIN member_memberships mm ON mp.id = mm.package_id
      GROUP BY mp.id, mp.name
      ORDER BY count DESC
    `);
    return result.rows;
  }

  // Duruma göre üyelik dağılımı
  async getMembershipsByStatus() {
    const result = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM member_memberships
      GROUP BY status
      ORDER BY count DESC
    `);
    return result.rows;
  }

  // Son 6 ayın üye kayıt istatistikleri
  async getMonthlyMemberRegistrations() {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM members
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month ASC
    `);
    return result.rows;
  }

  // Son 6 ayın üyelik başlangıç istatistikleri
  async getMonthlyMembershipStarts() {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(start_date, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM member_memberships
      WHERE start_date >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(start_date, 'YYYY-MM')
      ORDER BY month ASC
    `);
    return result.rows;
  }

  // Genel istatistik özeti
  async getStatisticsSummary() {
    const [
      totalMembers,
      activeMemberships,
      expiredMemberships,
      cancelledMemberships,
      membershipsByPackage,
      membershipsByStatus,
      monthlyRegistrations,
      monthlyMembershipStarts,
    ] = await Promise.all([
      this.getTotalMembers(),
      this.getActiveMemberships(),
      this.getExpiredMemberships(),
      this.getCancelledMemberships(),
      this.getMembershipsByPackage(),
      this.getMembershipsByStatus(),
      this.getMonthlyMemberRegistrations(),
      this.getMonthlyMembershipStarts(),
    ]);

    return {
      summary: {
        totalMembers,
        activeMemberships,
        expiredMemberships,
        cancelledMemberships,
        totalMemberships:
          activeMemberships + expiredMemberships + cancelledMemberships,
      },
      charts: {
        membershipsByPackage,
        membershipsByStatus,
        monthlyRegistrations,
        monthlyMembershipStarts,
      },
    };
  }
}

module.exports = new StatisticsRepository();
