const router = require('express').Router();
const adminController=require('../controllers/admin.controller.js');

router.get('/get',adminController.get);
router.post('/create-product',adminController.saveProduct);
router.put('/update-product', adminController.updateProduct);
router.delete('/remove-product',adminController.removeProduct)
module.exports=router