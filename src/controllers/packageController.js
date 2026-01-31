const packageService = require("../services/packageService");

class PackageController {
  // GET /api/packages
  async getAllPackages(req, res) {
    try {
      const packages = await packageService.getAllPackages();

      res.json({
        success: true,
        data: packages,
      });
    } catch (error) {
      console.error("Get packages error:", error);
      res.status(500).json({
        success: false,
        message: "Paketler getirilemedi",
      });
    }
  }

  // GET /api/packages/:id
  async getPackageById(req, res) {
    try {
      const { id } = req.params;
      const pkg = await packageService.getPackageById(id);

      res.json({
        success: true,
        data: pkg,
      });
    } catch (error) {
      console.error("Get package error:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Paket bulunamadı",
      });
    }
  }

  // POST /api/packages
  async createPackage(req, res) {
    try {
      const { name, durationInDays, price } = req.body;

      const pkg = await packageService.createPackage({
        name,
        durationInDays,
        price,
      });

      res.status(201).json({
        success: true,
        message: "Paket başarıyla oluşturuldu",
        data: pkg,
      });
    } catch (error) {
      console.error("Create package error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Paket oluşturulamadı",
      });
    }
  }

  // PUT /api/packages/:id
  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const { name, durationInDays, price } = req.body;

      const pkg = await packageService.updatePackage(id, {
        name,
        durationInDays,
        price,
      });

      res.json({
        success: true,
        message: "Paket başarıyla güncellendi",
        data: pkg,
      });
    } catch (error) {
      console.error("Update package error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Paket güncellenemedi",
      });
    }
  }

  // DELETE /api/packages/:id
  async deactivatePackage(req, res) {
    try {
      const { id } = req.params;

      await packageService.deactivatePackage(id);

      res.json({
        success: true,
        message: "Paket devre dışı bırakıldı",
      });
    } catch (error) {
      console.error("Deactivate package error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Paket devre dışı bırakılamadı",
      });
    }
  }
}

module.exports = new PackageController();
