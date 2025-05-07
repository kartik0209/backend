const {
  getCartByUser,
  createOrUpdateCart,
  removeCartItem,
  clearCart,
} = require("../model/mongodb/Cart");
const { getProductById } = require("../model/mongodb/Product");

const getUserCart = async (req, res) => {
  try {
    const cart = await getCartByUser(req.user.id.toString());

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await getProductById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const item = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || "",
    };

    const cart = await createOrUpdateCart(req.user.id.toString(), item);

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearUserCart = async (req, res) => {
  try {
    const cart = await clearCart(req.user.id.toString());

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await removeCartItem(req.user.id.toString(), productId);

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number",
      });
    }

    // Check product exists and has sufficient stock
    const product = await getProductById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Create the item object to update
    const item = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || "",
    };

    // Update the cart
    const cart = await createOrUpdateCart(req.user.id.toString(), item);

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  clearUserCart,
  removeFromCart,
  updateCartItemQuantity,
};
