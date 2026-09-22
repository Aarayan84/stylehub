const express = require("express");

const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  ownerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// Public Routes
// =========================

router.get("/", getProducts);

router.get("/:id", getProductById);

// =========================
// Owner Routes
// =========================

// Create product
router.post(
  "/",
  protect,
  ownerOnly,
  upload.single("image"),
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  ownerOnly,
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  ownerOnly,
  deleteProduct
);

module.exports = router;