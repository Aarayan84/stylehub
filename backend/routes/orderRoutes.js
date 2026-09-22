const express = require("express");

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  trackOrder,
} = require("../controllers/orderController");

const {
  protect,
  ownerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer
router.post("/", createOrder);

// Customer order tracking
router.post("/track", trackOrder);

// Owner
router.get(
  "/",
  protect,
  ownerOnly,
  getOrders
);

router.get(
  "/:id",
  protect,
  ownerOnly,
  getOrderById
);

router.put(
  "/:id/status",
  protect,
  ownerOnly,
  updateOrderStatus
);

// Permanently delete order - owner only
router.delete(
  "/:id",
  protect,
  ownerOnly,
  deleteOrder
);

module.exports = router;