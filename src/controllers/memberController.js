const memberService = require("../services/memberService");

class MemberController {
  // GET /api/members
  async getAllMembers(req, res) {
    try {
      const members = await memberService.getAllMembers();

      res.json({
        success: true,
        data: members,
      });
    } catch (error) {
      console.error("Get members error:", error);
      res.status(500).json({
        success: false,
        message: "Üyeler getirilemedi",
      });
    }
  }

  // GET /api/members/:id
  async getMemberById(req, res) {
    try {
      const { id } = req.params;
      const member = await memberService.getMemberById(id);

      res.json({
        success: true,
        data: member,
      });
    } catch (error) {
      console.error("Get member error:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Üye bulunamadı",
      });
    }
  }

  // POST /api/members
  async createMember(req, res) {
    try {
      const { firstName, lastName, email } = req.body;

      const member = await memberService.createMember({
        firstName,
        lastName,
        email,
      });

      res.status(201).json({
        success: true,
        message: "Üye başarıyla eklendi",
        data: member,
      });
    } catch (error) {
      console.error("Create member error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Üye eklenemedi",
      });
    }
  }

  // PUT /api/members/:id
  async updateMember(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email } = req.body;

      const member = await memberService.updateMember(id, {
        firstName,
        lastName,
        email,
      });

      res.json({
        success: true,
        message: "Üye başarıyla güncellendi",
        data: member,
      });
    } catch (error) {
      console.error("Update member error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Üye güncellenemedi",
      });
    }
  }

  // DELETE /api/members/:id
  async deleteMember(req, res) {
    try {
      const { id } = req.params;

      await memberService.deleteMember(id);

      res.json({
        success: true,
        message: "Üye başarıyla silindi",
      });
    } catch (error) {
      console.error("Delete member error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Üye silinemedi",
      });
    }
  }
}

module.exports = new MemberController();
