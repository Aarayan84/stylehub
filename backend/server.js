const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const orderRoutes = require("./routes/orderRoutes");

connectDB();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StyleHub API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StyleHub server running on port ${PORT}`);
});