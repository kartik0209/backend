// Basic validation middleware for request bodies
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email and password",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Email validation regex
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, description, price and category",
    });
  }

  if (price < 0) {
    return res.status(400).json({
      success: false,
      message: "Price cannot be negative",
    });
  }

  if (stock && stock < 0) {
    return res.status(400).json({
      success: false,
      message: "Stock cannot be negative",
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "Please provide shipping address and payment method",
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProduct,
  validateOrder,
};
