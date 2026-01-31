const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membershipController");
const { requireAuth } = require("../middlewares/authMiddleware");

// All membership routes require authentication
router.use(requireAuth);

router.get(
  "/",
  membershipController.getAllMemberships.bind(membershipController),
);
router.get(
  "/active",
  membershipController.getActiveMemberships.bind(membershipController),
);
router.get(
  "/expired",
  membershipController.getExpiredMemberships.bind(membershipController),
);
router.get(
  "/member/:memberId",
  membershipController.getMembershipsByMemberId.bind(membershipController),
);
router.post(
  "/assign",
  membershipController.assignPackage.bind(membershipController),
);
router.post(
  "/renew",
  membershipController.renewMembership.bind(membershipController),
);
router.post(
  "/check-expired",
  membershipController.checkExpiredMemberships.bind(membershipController),
);
router.put(
  "/:id/cancel",
  membershipController.cancelMembership.bind(membershipController),
);

module.exports = router;
