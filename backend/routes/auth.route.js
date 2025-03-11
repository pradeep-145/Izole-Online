const express = require('express');
const router= express.Router();
const AuthController = require('../controllers/auth.controller.js')

router.post('/sign-up',AuthController.signUp);
router.post('/sign-in',AuthController.signIn);
router.post('/confirm',AuthController.confirmUser);

module.exports=router;