const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: String,
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: String, // SQL User ID as string
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);

// Cart functions
const getCartByUser = async (userId) => Cart.findOne({ user: userId });

const createOrUpdateCart = async (userId, item) => {
  const cart = await Cart.findOne({ user: userId });
  console.log(cart);
  if (!cart) {
    return await Cart.create({
      user: userId,
      items: [item],
      totalItems: item.quantity,
      totalAmount: item.price * item.quantity,
    });
  }

  const existingIndex = cart.items.findIndex(
    (i) => i.product.toString() === item.product.toString()
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  cart.totalAmount = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  cart.updatedAt = Date.now();

  return await cart.save();
};

const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  cart.totalAmount = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  cart.updatedAt = Date.now();

  return await cart.save();
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;
  cart.updatedAt = Date.now();

  return await cart.save();
};

module.exports = {
  Cart,
  getCartByUser,
  createOrUpdateCart,
  removeCartItem,
  clearCart,
};
