const router = require("express").Router();
const ProductController = require("../controllers/product.controller.js");

router.post('/save',ProductController.saveProduct);
router.get('/get',ProductController.getProducts);

module.exports = router;