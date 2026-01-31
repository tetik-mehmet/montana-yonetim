const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const { requireAuth } = require("../middlewares/authMiddleware");

// All package routes require authentication
router.use(requireAuth);

router.get("/", packageController.getAllPackages.bind(packageController));
router.get("/:id", packageController.getPackageById.bind(packageController));
router.post("/", packageController.createPackage.bind(packageController));
router.put("/:id", packageController.updatePackage.bind(packageController));
router.delete(
  "/:id",
  packageController.deactivatePackage.bind(packageController),
);

module.exports = router;
