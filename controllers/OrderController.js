const {
  createOrder,
  getOrderById,
  getUserOrders,
} = require("../model/sql/Order");
const { createOrderItems, getOrderItems } = require("../model/sql/OrderItem");
const { getCartByUser, clearCart } = require("../model/mongodb/Cart");
const { getProductById } = require("../model/mongodb/Product");

// Create new order (checkout)
const checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await getCartByUser(req.user.id.toString());

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Verify all products exist and have sufficient stock
    for (const item of cart.items) {
      const product = await getProductById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} no longer exists`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} of ${item.name} available in stock`,
        });
      }
    }

    // Create order
    const order = await createOrder({
      user_id: req.user.id,
      total_amount: cart.totalAmount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: "pending",
    });

    // Create order items
    const orderItems = cart.items.map((item) => ({
      order_id: order.id,
      product_id: item.product.toString(),
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      total_price: item.price * item.quantity,
      shipping_address: item.adaddress,
    }));

    await createOrderItems(orderItems);

    // Update product stock (in a real application, this should be done in a transaction)
    for (const item of cart.items) {
      const product = await getProductById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear cart
    await clearCart(req.user.id.toString());

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        totalAmount: order.total_amount,
        status: order.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is owner of the order
    if (order.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    // Get order items
    const orderItems = await getOrderItems(order.id);

    res.status(200).json({
      success: true,
      data: {
        ...order.toJSON(),
        items: orderItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all orders for logged in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
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
  checkout,
  getOrder,
  getMyOrders,
};
