const Cart = require("../models/cart.model.js");
const Product = require("../models/product.model.js");

const getOrCreateCart = async (customerId) => {
  let cart = await Cart.findOne({ customerId }).populate({
    path: 'products.productId',
    model: 'Product'
  });

  if (!cart) {
    cart = new Cart({
      customerId,
      products: []
    });
    await cart.save();
  }

  return cart;
};
const CartController = {
  addToCart: async (req, res) => {
    try {
      const { product, quantity, color, size, price, image } = req.body;
      const customerId = req.user.userId;
  
      // Validate product exists
      const productExists = await Product.findById(product._id);
      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
  
      // Get cart
      const cart = await getOrCreateCart(customerId);
  
      // Check if product with same color and size already exists in cart
      const existingItemIndex = cart.products.findIndex(
        item => 
          item.productId.toString() === product._id && 
          item.color === color && 
          item.size === size
      );
  
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        cart.products[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.products.push({
          productId: product._id,
          quantity,
          color,
          size,
          price,
          image
        });
      }
  
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Item added to cart",
        item: {
          product,
          quantity,
          color,
          size,
          price,
          image
        }
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add item to cart"
      });
    }},
  getCart: async (req, res) => {
    try {
      const customerId = req.user.userId; // Assuming user is authenticated
      const cart = await getOrCreateCart(customerId);
  
      // Format cart items to match frontend expectations
      const items = cart.products.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        price: item.price,
        image: item.image
      }));
  
      res.status(200).json({
        success: true,
        items
      });
    } catch (error) {
      console.error("Get cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve cart"
      });
    }
  },
  updateCart:async(req,res)=>{
    try {
      const { productId, color, size, quantity } = req.body;
      const customerId = req.user.userId; // Assuming user is authenticated
  
      const cart = await Cart.findOne({ customerId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found"
        });
      }
  
      // Find item in cart
      const itemIndex = cart.products.findIndex(
        item => 
          item.productId.toString() === productId && 
          item.color === color && 
          item.size === size
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart"
        });
      }
  
      // Update quantity
      cart.products[itemIndex].quantity = quantity;
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Cart updated successfully"
      });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update cart"
      });
    }
  },
  removeCart:async(req,res)=>{
    try {
      const { productId, color, size } = req.body;
      const customerId = req.user.userId; // Assuming user is authenticated
  
      const cart = await Cart.findOne({ customerId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found"
        });
      }
  
      // Remove item
      cart.products = cart.products.filter(
        item => 
          !(item.productId.toString() === productId && 
            item.color === color && 
            item.size === size)
      );
  
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Item removed from cart"
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to remove item from cart"
      });
    }
  },
  cleanCart:async(req,res)=>{
    try {
      const customerId = req.user.userId; // Assuming user is authenticated
  
      const cart = await Cart.findOne({ customerId });
      if (cart) {
        cart.products = [];
        await cart.save();
      }
  
      res.status(200).json({
        success: true,
        message: "Cart cleared successfully"
      });
    } catch (error) {
      console.error("Clear cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to clear cart"
      });
    }
  }
};

module.exports = CartController;