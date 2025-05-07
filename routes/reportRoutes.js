const express = require("express");
const {
  getDailyRevenueReport,
  getTopSpendersReport,
  getProductSalesReport,
  getSalesByCategoryReport,
} = require("../controllers/ReportController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// All report routes require authentication and admin role
router.use(protect);

// Route: /api/reports/daily-revenue
router.get("/daily-revenue", getDailyRevenueReport);

// Route: /api/reports/top-spenders
router.get("/top-spenders", getTopSpendersReport);

// Route: /api/reports/product-sales
router.get("/product-sales", getProductSalesReport);

// Route: /api/reports/sales-by-category
router.get("/sales-by-category", getSalesByCategoryReport);

module.exports = router;
