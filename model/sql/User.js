const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Instance method
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Extra functions
const createUser = async (userData) => await User.create(userData);

const findUserByEmail = async (email) =>
  await User.findOne({ where: { email } });

const findUserById = async (id) => await User.findByPk(id);

const getTopSpenders = async (limit = 3) => {
  const [results] = await sequelize.query(`
    SELECT u.id, u.name, u.email, SUM(o.total_amount) as total_spent
    FROM Users u
    JOIN Orders o ON u.id = o.user_id
    GROUP BY u.id, u.name, u.email
    ORDER BY total_spent DESC
    LIMIT ${limit}
  `);

  return results;
};

module.exports = {
  User,
  createUser,
  findUserByEmail,
  findUserById,
  getTopSpenders,
};
