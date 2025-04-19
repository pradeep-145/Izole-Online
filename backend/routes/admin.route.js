const router = require('express').Router();
const adminController=require('../controllers/admin.controller.js');

router.get('/get',adminController.get);


module.exports=router