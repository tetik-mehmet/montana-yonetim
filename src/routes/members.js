const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { requireAuth } = require("../middlewares/authMiddleware");

// All member routes require authentication
router.use(requireAuth);

router.get("/", memberController.getAllMembers.bind(memberController));
router.get("/:id", memberController.getMemberById.bind(memberController));
router.post("/", memberController.createMember.bind(memberController));
router.put("/:id", memberController.updateMember.bind(memberController));
router.delete("/:id", memberController.deleteMember.bind(memberController));

module.exports = router;
