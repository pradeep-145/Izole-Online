const router = require("express").Router();
const CartController = require("../controllers/cart.controller.js");

router.post("/add", CartController.addToCart);
router.get("/get", CartController.getCart);

module.exports = router;
