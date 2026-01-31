const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Public routes
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.get("/me", authController.getCurrentUser.bind(authController));

module.exports = router;
