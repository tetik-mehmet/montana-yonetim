const membershipService = require("../services/membershipService");

class MembershipController {
  // GET /api/memberships
  async getAllMemberships(req, res) {
    try {
      const memberships = await membershipService.getAllMemberships();

      res.json({
        success: true,
        data: memberships,
      });
    } catch (error) {
      console.error("Get memberships error:", error);
      res.status(500).json({
        success: false,
        message: "Üyelikler getirilemedi",
      });
    }
  }

  // GET /api/memberships/active
  async getActiveMemberships(req, res) {
    try {
      const memberships = await membershipService.getActiveMemberships();

      res.json({
        success: true,
        data: memberships,
      });
    } catch (error) {
      console.error("Get active memberships error:", error);
      res.status(500).json({
        success: false,
        message: "Aktif üyelikler getirilemedi",
      });
    }
  }

  // GET /api/memberships/expired
  async getExpiredMemberships(req, res) {
    try {
      const memberships = await membershipService.getExpiredMemberships();

      res.json({
        success: true,
        data: memberships,
      });
    } catch (error) {
      console.error("Get expired memberships error:", error);
      res.status(500).json({
        success: false,
        message: "Süresi dolmuş üyelikler getirilemedi",
      });
    }
  }

  // GET /api/memberships/member/:memberId
  async getMembershipsByMemberId(req, res) {
    try {
      const { memberId } = req.params;
      const memberships =
        await membershipService.getMembershipsByMemberId(memberId);

      res.json({
        success: true,
        data: memberships,
      });
    } catch (error) {
      console.error("Get member memberships error:", error);
      res.status(500).json({
        success: false,
        message: "Üye üyelikleri getirilemedi",
      });
    }
  }

  // POST /api/memberships/assign
  async assignPackage(req, res) {
    try {
      const { memberId, packageId, startDate } = req.body;

      if (!memberId || !packageId || !startDate) {
        return res.status(400).json({
          success: false,
          message: "Üye, paket ve başlangıç tarihi gereklidir",
        });
      }

      const membership = await membershipService.assignPackageToMember(
        memberId,
        packageId,
        startDate,
      );

      res.status(201).json({
        success: true,
        message: "Paket başarıyla atandı",
        data: membership,
      });
    } catch (error) {
      console.error("Assign package error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Paket atanamadı",
      });
    }
  }

  // POST /api/memberships/renew
  async renewMembership(req, res) {
    try {
      const { memberId, packageId } = req.body;

      if (!memberId || !packageId) {
        return res.status(400).json({
          success: false,
          message: "Üye ve paket gereklidir",
        });
      }

      const membership = await membershipService.renewMembership(
        memberId,
        packageId,
      );

      res.status(201).json({
        success: true,
        message: "Üyelik başarıyla yenilendi",
        data: membership,
      });
    } catch (error) {
      console.error("Renew membership error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Üyelik yenilenemedi",
      });
    }
  }

  // POST /api/memberships/check-expired
  async checkExpiredMemberships(req, res) {
    try {
      const updated =
        await membershipService.checkAndUpdateExpiredMemberships();

      res.json({
        success: true,
        message: `${updated.length} üyelik süresi dolmuş olarak işaretlendi`,
        data: updated,
      });
    } catch (error) {
      console.error("Check expired memberships error:", error);
      res.status(500).json({
        success: false,
        message: "Süre dolmuş üyelikler kontrol edilemedi",
      });
    }
  }

  // PUT /api/memberships/:id/cancel
  async cancelMembership(req, res) {
    try {
      const { id } = req.params;

      const membership = await membershipService.cancelMembership(id);

      res.json({
        success: true,
        message: "Üyelik iptal edildi",
        data: membership,
      });
    } catch (error) {
      console.error("Cancel membership error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Üyelik iptal edilemedi",
      });
    }
  }
}

module.exports = new MembershipController();
