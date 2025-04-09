const router = require("express").Router();
const CartController = require("../controllers/cart.controller.js");
const customerAuth=require('../middlewares/customer.middleware.js')
router.post("/add",customerAuth, CartController.addToCart);
router.put("/update",customerAuth, CartController.updateCart);
router.get("/get",customerAuth, CartController.getCart);
router.delete("/delete", customerAuth, CartController.removeCart);
router.delete('/clear', customerAuth, CartController.cleanCart)

module.exports = router;
