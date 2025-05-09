const axios = require("axios");
require("dotenv").config();
const getAuthToken = async () => {
  try {
    const token = await axios.post(
      `https://apiv2.shiprocket.in/v1/external/auth/login`,
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (token.data && token.data.token) {
      return token.data.token;
    } else {
      console.error("Error getting auth token:", token.data);
      return null;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

const makeAuthenticatedRequest = async (
  token,
  endpoint,
  method,
  data,
  queryParams
) => {
  if (!token) {
    token = await getAuthToken();
  }
  // console.log(token)
  try {
    const config = {
      url: `https://apiv2.shiprocket.in/v1/external/${endpoint}`,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (data) {
      config.data = data;
    }

    if (queryParams) {
      config.params = queryParams;
    }

    const response = await axios(config);

    console.log("Response from Shiprocket:", response.data);

    return { data: response.data, token };
  } catch (error) {
    // Check for token expiration
    if ((error.response && error.response.status === 401) || !token) {
      const newToken = await getAuthToken();
      return makeAuthenticatedRequest(
        newToken,
        endpoint,
        method,
        data,
        queryParams
      );
    }
    console.log(error)
    // Get detailed error information from the response if available
    const errorDetails =
      error.response && error.response.data
        ? error.response.data
        : { message: "Unknown error with Shiprocket API" };

    // Log the error with more context
    console.error("Error making authenticated request to Shiprocket:", {
      endpoint,
      method,
      errorStatus: error.response?.status,
      errorDetails,
    });

    // Return a structured error response
    return {
      error: true,
      status: error.response?.status || 500,
      message: errorDetails.message || error.message,
      details: errorDetails,
      token,
    };
  }
};

module.exports = {
  createOrder: (token, orderData) => {
    return makeAuthenticatedRequest(
      token,
      "orders/create/adhoc",
      "POST",
      orderData
    );
  },
  cancelOrder: (token, orderId) => {
    return makeAuthenticatedRequest(token, `orders/cancel/${orderId}`, "POST");
  },
  generateAWB: (token, data) => {
    return makeAuthenticatedRequest(token, `courier/assign/awb`, "POST", {
      shipment_id: data.shipment_id,
      courier_id: data.courier_id
    });
  },
  getAWB: (token, awb) => {
    return makeAuthenticatedRequest(
      token,
      `courier/generate/awb/${awb}`,
      "GET"
    );
  },
  getOrderDetails: (token, orderId) => {
    return makeAuthenticatedRequest(token, `orders/show/${orderId}`, "GET");
  },

  getShipments: (token, orderId) => {
    return makeAuthenticatedRequest(token, `shipments/${orderId}`, "GET");
  },
  getTracking: (token, awb) => {
    return makeAuthenticatedRequest(token, `courier/track/awb/${awb}`, "GET");
  },
  getCouriers: (token) => {
    return makeAuthenticatedRequest(token, `courier`, "GET");
  },
  checkServiceability: (token, params) => {
    return makeAuthenticatedRequest(
      token,
      "courier/serviceability",
      "GET",
      null,
      params
    );
  },
  getAuthToken: () => {
    return getAuthToken();
  },
  makeAuthenticatedRequest, // Export this for custom requests
};
