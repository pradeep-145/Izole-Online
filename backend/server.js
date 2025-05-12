const express = require("express");
const connectToDB = require("./db/db.js");
const cors = require("cors");
const authRoute = require("./routes/auth.route.js");
const productRoute = require("./routes/product.route.js");
const cartRoute = require("./routes/cart.route.js");
const OrderRoute = require("./routes/order.route.js");
const wishlistRoutes = require("./routes/wishlist.route.js");
const { processContactForm } = require("./controllers/contact.controller.js");

const app = express();
require("dotenv").config();

// Connect to DB at startup (will be invoked once per container)
connectToDB().catch((err) => console.error("Failed to connect to DB:", err));

// In your Express app
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", require("./routes/admin.route.js"));
app.use("/api/shiprocket", require("./routes/shiprocket.routes.js"));
app.use("/api/notifications", require("./routes/notification.route.js")); // Add notification routes

// Contact form endpoint
app.post("/api/contact", processContactForm);

// Health check endpoint for AWS
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;

// Only start the server if not being imported (for local dev)
if (require.main === module) {
  const PORT = process.env.PORT || 1220;
  app.listen(PORT, () => {
    console.log(`Server is running in port http://localhost:${PORT}`);
  });
}
