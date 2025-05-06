const axios = require("axios");
require("dotenv").config();
const { getAuthToken } = require("../services/shiprocket.service");

exports.ShiprocketController = {
  checkServiceability: async (req, res) => {
    try {
      const { pickup_postcode, delivery_postcode, weight, cod } = req.body;

      if (!pickup_postcode || !delivery_postcode || !weight) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters",
        });
      }

      // Get Shiprocket token
      const token = req.shiprocketToken || (await getAuthToken());

      // Make request to Shiprocket API
      const response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/courier/serviceability`,
        {
          params: {
            pickup_postcode: pickup_postcode,
            delivery_postcode: delivery_postcode,
            weight: weight,
            cod: cod || 0,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Return the couriers data
      res.status(200).json({
        success: true,
        couriers: response.data.data.available_courier_companies,
        message: "Serviceability checked successfully",
      });
    } catch (error) {
      console.error("Error checking serviceability:", error);
      res.status(500).json({
        success: false,
        message:
          error.response?.data?.message || "Error checking serviceability",
      });
    }
  },
};
