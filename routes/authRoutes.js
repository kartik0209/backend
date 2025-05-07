const express = require("express");
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/AuthController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Route: /api/auth/register
router.post("/register", register);

// Route: /api/auth/login
router.post("/login", login);

// Route: /api/auth/me
router.get("/me", protect, getCurrentUser);

module.exports = router;
