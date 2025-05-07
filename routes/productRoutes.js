const express = require("express");
const {
  getProducts,
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  search,
} = require("../controllers/ProductController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Route: /api/products
router.get("/", getProducts);

// Route: /api/products/search
router.get("/search", search);

// Route: /api/products/:id
router.get("/:id", getProduct);

// Protected admin routes
router.post("/", protect, admin, createNewProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
