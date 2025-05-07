const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const { Order } = require("./Order");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "id",
    },
  },
  product_id: {
    type: DataTypes.STRING, // MongoDB ObjectId stored as string
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
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
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id" });

// Methods for order item model operations
const createOrderItems = async (items) => {
  return await OrderItem.bulkCreate(items);
};

const getOrderItems = async (orderId) => {
  return await OrderItem.findAll({
    where: { order_id: orderId },
  });
};

const getProductSales = async () => {
  // Advanced SQL query for product sales
  const [results] = await sequelize.query(`
    SELECT 
      product_id,
      product_name,
      SUM(quantity) as total_quantity,
      SUM(total_price) as total_sales
    FROM OrderItems
    GROUP BY product_id, product_name
    ORDER BY total_sales DESC
  `);

  return results;
};

module.exports = {
  OrderItem,
  createOrderItems,
  getOrderItems,
  getProductSales,
};
