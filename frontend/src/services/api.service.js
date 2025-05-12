import axios from "axios";

const API_BASE_URL =
  "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from storage if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Contact form submission
export const contactService = {
  submitContactForm: async (formData) => {
    try {
      const response = await api.post("/contact", formData);
      return response.data;
    } catch (error) {
      console.error("Contact form submission error:", error);
      throw error;
    }
  },
};

export default api;
