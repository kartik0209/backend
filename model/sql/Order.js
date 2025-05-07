const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const { User } = require("./User");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ),
    defaultValue: "pending",
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.TEXT,
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  payment_status: {
    type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
    defaultValue: "pending",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations
Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

// Methods for order model operations
const createOrder = async (orderData) => {
  return await Order.create(orderData);
};

const getOrderById = async (id) => {
  return await Order.findByPk(id);
};

const getUserOrders = async (userId) => {
  return await Order.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
  });
};

const getDailyRevenue = async (days = 7) => {
  // Advanced SQL query for daily revenue
  const [results] = await sequelize.query(`
    SELECT 
      DATE(createdAt) as date,
      SUM(total_amount) as revenue
    FROM Orders
    WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
    GROUP BY DATE(createdAt)
    ORDER BY date DESC
  `);

  return results;
};

module.exports = {
  Order,
  createOrder,
  getOrderById,
  getUserOrders,
  getDailyRevenue,
};
