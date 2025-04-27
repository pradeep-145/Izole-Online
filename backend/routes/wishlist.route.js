const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller.js');
const authMiddleware  = require('../middlewares/customer.middleware.js');

// All wishlist routes require authentication
router.use(authMiddleware);

// Get user's wishlist
router.get('/get', wishlistController.getWishlist);

// Add item to wishlist
router.post('/add', wishlistController.addToWishlist);

// Remove item from wishlist
router.delete('/remove', wishlistController.removeFromWishlist);

// Clear wishlist
router.delete('/clear', wishlistController.clearWishlist);

// Check if product is in wishlist
router.get('/check/:productId', wishlistController.checkWishlistItem);

module.exports = router;