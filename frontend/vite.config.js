import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server during development
      "/api": {
        target: "http://localhost:1220", // Your backend API address
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
