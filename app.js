const express = require("express");
const cors = require("cors");
const { sqlConnection } = require("./config/db");
const { mongoConnection } = require("./config/db");
const errorHandler = require("./utils/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to databases
sqlConnection();
mongoConnection();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
