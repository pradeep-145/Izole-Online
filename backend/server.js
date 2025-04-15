const express = require("express");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db.js");
const cors = require("cors");
const authRoute = require("./routes/auth.route.js");
const productRoute = require("./routes/product.route.js");
const cartRoute = require("./routes/cart.route.js");
const OrderRoute = require("./routes/order.route.js");
const wishlistRoutes = require('./routes/wishlist.route.js');

const app = express();
require("dotenv").config();

// Connect to DB at startup (will be invoked once per container)
connectToDB().catch(err => console.error("Failed to connect to DB:", err));

app.use(cors({
  origin: 'http://izole.s3-website.ap-south-1.amazonaws.com',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use("/api/products", productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', OrderRoute);
app.use('/api/wishlist', wishlistRoutes);

// Health check endpoint for AWS
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;

// Only start the server if not being imported (for local dev)
if (require.main === module) {
  const PORT = process.env.PORT || 1220;
  app.listen(PORT, () => {
    console.log(`Server is running in port http://localhost:${PORT}`);
  });
}