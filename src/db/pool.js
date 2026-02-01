const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || "dpg-d5uug2ffte5s73cb0tng-a",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "membership_db_xeu9_user",
  password: process.env.DB_PASSWORD || "moIfhCfdg2gCXP68cFKRLlfpvBLXHyik",
  database: process.env.DB_NAME || "membership_db_xeu9",
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on("connect", () => {
  console.log("PostgreSQL veritabanına bağlandı");
});

pool.on("error", (err) => {
  console.error("PostgreSQL bağlantı hatası:", err);
  process.exit(-1);
});

module.exports = pool;
