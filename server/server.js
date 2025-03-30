const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); // 🆕 Add this line

// ✅ Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes); // 🆕 Mount it

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
