const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
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

// Index for searching
ProductSchema.index({ name: "text", description: "text" });

// Create model
const Product = mongoose.model("Product", ProductSchema);

// Methods for product model operations
const createProduct = async (productData) => {
  return await Product.create(productData);
};

const getAllProducts = async (page = 1, limit = 10, query = {}) => {
  const skip = (page - 1) * limit;
  return await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const searchProducts = async (searchTerm, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  return await Product.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit);
};

const getSalesByCategory = async () => {
  // MongoDB aggregation to get sales by category
  return await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $group: {
        _id: "$categoryInfo._id",
        categoryName: { $first: "$categoryInfo.name" },
        productCount: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { productCount: -1 },
    },
  ]);
};

module.exports = {
  Product,
  createProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  getSalesByCategory,
};
