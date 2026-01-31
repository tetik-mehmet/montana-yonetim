const authService = require("../services/authService");

// Middleware to check if user is authenticated
const requireAuth = async (req, res, next) => {
  try {
    // Check if session exists and has adminId
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: "Oturum bulunamadı. Lütfen giriş yapınız.",
      });
    }

    // Validate session with database
    const admin = await authService.validateSession(req.session.adminId);

    if (!admin) {
      // Session is invalid, destroy it
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: "Oturum geçersiz. Lütfen tekrar giriş yapınız.",
      });
    }

    // Attach admin to request for use in controllers
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Kimlik doğrulama hatası",
    });
  }
};

// Optional auth - doesn't block if not authenticated
const optionalAuth = async (req, res, next) => {
  try {
    if (req.session && req.session.adminId) {
      const admin = await authService.validateSession(req.session.adminId);
      if (admin) {
        req.admin = admin;
      }
    }
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};
