const statisticsRepository = require("../repositories/statisticsRepository");

class StatisticsService {
  async getStatistics() {
    try {
      const statistics = await statisticsRepository.getStatisticsSummary();
      return statistics;
    } catch (error) {
      console.error("Statistics service error:", error);
      throw new Error("İstatistikler alınamadı");
    }
  }
}

module.exports = new StatisticsService();
