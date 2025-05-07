require("dotenv").config();
const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.SQL_DATABASE,
  process.env.SQL_USER,
  process.env.SQL_PASSWORD,
  {
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: process.env.SQL_DIALECT,
    logging: false,
  }
);

const sqlConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL DB connection established successfully.");
  } catch (err) {
    console.error("SQL DB connection error:", err);
    process.exit(1);
  }
};

const mongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = { sequelize, sqlConnection, mongoConnection };
