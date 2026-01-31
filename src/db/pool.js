const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "membership_db",
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
