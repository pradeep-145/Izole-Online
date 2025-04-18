const router = require("express").Router();
const ProductController = require("../controllers/product.controller.js");

router.post('/save',ProductController.saveProduct);
router.get('/get-products',ProductController.getProducts);
router.post('/add-review',ProductController.addReview);


module.exports = router;