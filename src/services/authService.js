const bcrypt = require("bcrypt");
const adminRepository = require("../repositories/adminRepository");

class AuthService {
  // Login admin user
  async login(username, password) {
    // Find admin by username
    const admin = await adminRepository.findByUsername(username);

    if (!admin) {
      throw new Error("Kullanıcı adı veya şifre hatalı");
    }

    // Check if admin is active
    if (!admin.is_active) {
      throw new Error("Hesap aktif değil");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      throw new Error("Kullanıcı adı veya şifre hatalı");
    }

    // Return admin without password
    const { password_hash, ...adminData } = admin;
    return adminData;
  }

  // Validate session
  async validateSession(adminId) {
    const admin = await adminRepository.findById(adminId);

    if (!admin || !admin.is_active) {
      return null;
    }

    const { password_hash, ...adminData } = admin;
    return adminData;
  }

  // Create admin (for initial setup)
  async createAdmin(username, password) {
    // Check if username already exists
    const existingAdmin = await adminRepository.findByUsername(username);

    if (existingAdmin) {
      throw new Error("Bu kullanıcı adı zaten kullanılıyor");
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create admin
    const admin = await adminRepository.createAdmin(username, passwordHash);

    const { password_hash, ...adminData } = admin;
    return adminData;
  }
}

module.exports = new AuthService();
