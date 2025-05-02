const router = require('express').Router();
const adminController = require('../controllers/admin.controller.js');

// Existing routes
router.get('/get', adminController.get);
router.post('/create-product', adminController.saveProduct);
router.put('/update-product', adminController.updateProduct);
router.delete('/remove-product', adminController.removeProduct);

// New routes for inventory and order management
router.get('/inventory', adminController.getInventory); // Fetch inventory
router.put('/inventory/update', adminController.updateInventory); // Update inventory
router.get('/orders', adminController.getOrders); // Fetch orders
router.put('/orders/update', adminController.updateOrders); // Update order status

module.exports = router;