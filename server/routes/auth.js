const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../config/authMiddleware");

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Get User Profile (Protected)
router.get("/profile", protect, getUserProfile);

module.exports = router;
