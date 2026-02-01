const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10 saniye timeout (Render için daha uzun)
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test connection on startup
pool.on("connect", () => {
  console.log("PostgreSQL veritabanına bağlandı");
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool hatası:", err);
  // UYARI: Uygulamayı kapatmıyoruz! Sunucu çalışmaya devam edecek.
  // Database bağlantısı tekrar denenecek.
});

module.exports = pool;
