const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const Category = mongoose.model("Category", CategorySchema);

// Methods for category model operations
const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const getCategoryWithChildren = async (parentId = null) => {
  return await Category.find({ parent: parentId }).sort({ name: 1 });
};

module.exports = {
  Category,
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryWithChildren,
};
