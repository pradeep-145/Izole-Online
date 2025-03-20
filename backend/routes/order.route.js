const router = require('express').Router();
const {OrderController} = require('../controllers/order.controller.js');
router.post('/add',OrderController.addOrder);
router.get('/get',OrderController.getOrders);
router.get('/get-order-count/:id',)
module.exports=router;