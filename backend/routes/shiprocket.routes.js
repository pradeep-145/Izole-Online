const express = require("express");
const router = express.Router();
const {
  ShiprocketController,
} = require("../controllers/shiprocket.controller");
const customerAuth = require("../middlewares/customer.middleware.js");

router.post(
  "/check-serviceability",
  customerAuth,
  ShiprocketController.checkServiceability
);

module.exports = router;
