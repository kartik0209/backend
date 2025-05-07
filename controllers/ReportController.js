const { getDailyRevenue, getTopSpenders } = require("../model/sql/Order");
const { getProductSales } = require("../model/sql/OrderItem");
const { getSalesByCategory } = require("../model/mongodb/Product");

// Get daily revenue for the last 7 days
const getDailyRevenueReport = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access reports",
      });
    }

    const days = req.query.days ? parseInt(req.query.days) : 7;
    const revenueData = await getDailyRevenue(days);

    res.status(200).json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get top spenders
const getTopSpendersReport = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access reports",
      });
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const topSpenders = await getTopSpenders(limit);

    res.status(200).json({
      success: true,
      data: topSpenders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get product sales
const getProductSalesReport = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access reports",
      });
    }

    const productSales = await getProductSales();

    res.status(200).json({
      success: true,
      data: productSales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get sales by category
const getSalesByCategoryReport = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access reports",
      });
    }

    const categoryData = await getSalesByCategory();

    res.status(200).json({
      success: true,
      data: categoryData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDailyRevenueReport,
  getTopSpendersReport,
  getProductSalesReport,
  getSalesByCategoryReport,
};
