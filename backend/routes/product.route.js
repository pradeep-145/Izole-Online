const router=require('express').Router();
const ProductController=require('../controllers/product.controller.js')
const multer= require('multer');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
router.post('/save',upload.array("images",10),ProductController.saveProduct);

module.exports=router;