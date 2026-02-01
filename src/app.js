require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const memberRoutes = require("./routes/members");
const packageRoutes = require("./routes/packages");
const membershipRoutes = require("./routes/memberships");
const statisticsRoutes = require("./routes/statistics");

// Import database pool to test connection
const pool = require("./db/pool");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration (if frontend is on different domain)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    allowedOrigins.includes(origin) ||
    process.env.NODE_ENV === "development"
  ) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with PostgreSQL store
app.use(
  session({
    store: new pgSession({
      pool: pool, // PostgreSQL connection pool
      tableName: "session", // Session tablosu adı
      createTableIfMissing: true, // Tablo yoksa otomatik oluştur
    }),
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    proxy: true, // Render proxy'si için gerekli
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Production'da cross-site için 'none'
    },
  }),
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/statistics", statisticsRoutes);

// Root route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint bulunamadı",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sunucu hatası",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Test database connection before starting server
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("PostgreSQL bağlantı hatası:", err);
    console.log("Sunucu başlatıldı ancak veritabanına bağlanılamadı!");
    console.log("Lütfen PostgreSQL ayarlarını kontrol edin.");
  } else {
    console.log("PostgreSQL bağlantısı başarılı:", res.rows[0].now);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Üyelik Yönetim Sistemi                                  ║
║  Server: http://localhost:${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || "development"}                              ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
