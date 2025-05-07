const express = require("express");
const {
  checkout,
  getOrder,
  getMyOrders,
} = require("../controllers/OrderController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Route: /api/orders
router.post("/", checkout);
router.get("/myorders", getMyOrders);

// Route: /api/orders/:id
router.get("/:id", getOrder);

module.exports = router;
