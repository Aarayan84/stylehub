
const express = require("express");

const {
  registerOwner,
  login,
  getOwners,
  updateMyAccount,
} = require("../controllers/authController");

const {
  protect,
  ownerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/login", login);

// Owner-only
router.post(
  "/register",
  protect,
  ownerOnly,
  registerOwner
);

router.get(
  "/owners",
  protect,
  ownerOnly,
  getOwners
);

router.put(
  "/my-account",
  protect,
  ownerOnly,
  updateMyAccount
);

module.exports = router;

