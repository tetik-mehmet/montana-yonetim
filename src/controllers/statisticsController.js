const statisticsService = require("../services/statisticsService");

class StatisticsController {
  async getStatistics(req, res) {
    try {
      const statistics = await statisticsService.getStatistics();

      return res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      console.error("Statistics controller error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "İstatistikler alınamadı",
      });
    }
  }
}

module.exports = new StatisticsController();
