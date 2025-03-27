const express = require("express");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db.js");
const cors = require("cors");
const authRoute = require("./routes/auth.route.js");
const productRoute = require("./routes/product.route.js");
const cartRoute = require("./routes/cart.route.js");
const OrderRoute = require("./routes/order.route.js");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use("/api/products", productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/orders',OrderRoute)


const PORT = process.env.PORT || 1220;


app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running in port http://localhost:${PORT}`);
});
