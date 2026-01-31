const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Tüm istatistikler için auth gerekli
router.use(requireAuth);

// GET /api/statistics - Tüm istatistikleri getir
router.get("/", statisticsController.getStatistics);

module.exports = router;
