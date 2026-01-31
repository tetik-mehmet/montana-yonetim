// Test script to check admin password
const bcrypt = require("bcrypt");
const pool = require("./src/db/pool");

async function testLogin() {
  try {
    // Get admin from database
    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      ["admin"],
    );

    if (result.rows.length === 0) {
      console.log("❌ Admin kullanıcısı bulunamadı!");
      return;
    }

    const admin = result.rows[0];
    console.log("✅ Admin bulundu:");
    console.log("  - Username:", admin.username);
    console.log("  - Is Active:", admin.is_active);
    console.log("  - Password Hash:", admin.password_hash);
    console.log("  - Hash Length:", admin.password_hash.length);

    // Test password
    const testPassword = "admin123";
    console.log("\n🔐 Şifre test ediliyor:", testPassword);

    const isValid = await bcrypt.compare(testPassword, admin.password_hash);

    if (isValid) {
      console.log("✅ Şifre DOĞRU! Giriş yapabilmelisiniz.");
    } else {
      console.log("❌ Şifre YANLIŞ!");
      console.log("\n📝 Düzeltme için yeni hash:");
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log("SQL Komutu:");
      console.log(
        `UPDATE admins SET password_hash = '${newHash}' WHERE username = 'admin';`,
      );
    }

    await pool.end();
  } catch (error) {
    console.error("Hata:", error);
    process.exit(1);
  }
}

testLogin();
