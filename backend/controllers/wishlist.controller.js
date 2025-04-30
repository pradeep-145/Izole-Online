const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user's wishlist
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "items.product",
      model: "Product",
      select: "-__v",
    });

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    // Transform to expected format
    const items = wishlist.items.map((item) => ({
      product: item.product,
      addedAt: item.addedAt,
    }));

    res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Server error while fetching wishlist" });
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Validate productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if product exists - updated to work with new product structure
    const product = await Product.findById(productId);
    if (!product || !product.variants || product.variants.length === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or invalid product data" });
    }

    // Find user's wishlist or create new one
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [],
      });
    }

    // Check if product already in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(200).json({ message: "Product already in wishlist" });
    }

    // Add to wishlist
    wishlist.items.push({
      product: productId,
      addedAt: new Date(),
    });

    await wishlist.save();

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);

    // Handle duplicate key error (if unique index fails)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    res.status(500).json({ message: "Server error while adding to wishlist" });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove product from wishlist
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (wishlist.items.length === initialLength) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    await wishlist.save();

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res
      .status(500)
      .json({ message: "Server error while removing from wishlist" });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find and clear wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({
      message: "Wishlist cleared",
      wishlist,
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Server error while clearing wishlist" });
  }
};

// Check if product is in wishlist
exports.checkWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({
      user: userId,
      "items.product": productId,
    });

    const isInWishlist = !!wishlist;

    res.status(200).json({
      isInWishlist,
    });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ message: "Server error while checking wishlist" });
  }
};
