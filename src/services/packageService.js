const packageRepository = require("../repositories/packageRepository");

class PackageService {
  // Get all packages
  async getAllPackages() {
    return await packageRepository.findAll();
  }

  // Get package by id
  async getPackageById(id) {
    const pkg = await packageRepository.findById(id);

    if (!pkg) {
      throw new Error("Paket bulunamadı");
    }

    return pkg;
  }

  // Create new package
  async createPackage(packageData) {
    const { name, durationInDays, price } = packageData;

    // Validate input
    if (!name || !durationInDays || price === undefined) {
      throw new Error("Tüm alanlar zorunludur");
    }

    // Business rules
    if (durationInDays <= 0) {
      throw new Error("Süre 0'dan büyük olmalıdır");
    }

    if (price < 0) {
      throw new Error("Fiyat negatif olamaz");
    }

    // Create package
    return await packageRepository.create({
      name: name.trim(),
      durationInDays: parseInt(durationInDays),
      price: parseFloat(price),
    });
  }

  // Update package
  async updatePackage(id, packageData) {
    // Check if package exists
    const existingPackage = await packageRepository.findById(id);
    if (!existingPackage) {
      throw new Error("Paket bulunamadı");
    }

    const { name, durationInDays, price } = packageData;

    // Validate input
    if (!name || !durationInDays || price === undefined) {
      throw new Error("Tüm alanlar zorunludur");
    }

    // Business rules
    if (durationInDays <= 0) {
      throw new Error("Süre 0'dan büyük olmalıdır");
    }

    if (price < 0) {
      throw new Error("Fiyat negatif olamaz");
    }

    // Update package
    return await packageRepository.update(id, {
      name: name.trim(),
      durationInDays: parseInt(durationInDays),
      price: parseFloat(price),
    });
  }

  // Deactivate package
  async deactivatePackage(id) {
    const pkg = await packageRepository.findById(id);

    if (!pkg) {
      throw new Error("Paket bulunamadı");
    }

    return await packageRepository.deactivate(id);
  }
}

module.exports = new PackageService();
