const authService = require("../services/authService");

class AuthController {
  // POST /api/auth/login
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Kullanıcı adı ve şifre gereklidir",
        });
      }

      // Authenticate user
      const admin = await authService.login(username, password);

      // Create session
      req.session.adminId = admin.id;
      req.session.username = admin.username;

      res.json({
        success: true,
        message: "Giriş başarılı",
        data: admin,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({
        success: false,
        message: error.message || "Giriş başarısız",
      });
    }
  }

  // POST /api/auth/logout
  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({
            success: false,
            message: "Çıkış yapılamadı",
          });
        }

        res.json({
          success: true,
          message: "Çıkış başarılı",
        });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Çıkış yapılamadı",
      });
    }
  }

  // GET /api/auth/me
  async getCurrentUser(req, res) {
    try {
      if (!req.session || !req.session.adminId) {
        return res.status(401).json({
          success: false,
          message: "Oturum bulunamadı",
        });
      }

      const admin = await authService.validateSession(req.session.adminId);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Oturum geçersiz",
        });
      }

      res.json({
        success: true,
        data: admin,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({
        success: false,
        message: "Kullanıcı bilgisi alınamadı",
      });
    }
  }
}

module.exports = new AuthController();
