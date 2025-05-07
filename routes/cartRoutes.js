const express = require("express");
const {
  getUserCart,
  addToCart,
  removeFromCart,
  clearUserCart,
  updateCartItemQuantity,
} = require("../controllers/CartController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Require user to be authenticated
router.use(protect);

// Routes
router.get("/", getUserCart); // GET /api/cart
router.post("/", addToCart); // POST /api/cart { productId, quantity }
router.put("/:productId", updateCartItemQuantity); // PUT /api/cart/:productId { quantity }
router.delete("/", clearUserCart); // DELETE /api/cart
router.delete("/:productId", removeFromCart); // DELETE /api/cart/:productId

module.exports = router;
