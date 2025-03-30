// server/routes/studentRoutes.js

const express = require("express");
const router = express.Router();
const Tutor = require("../models/Tutor");
const User = require("../models/User");

// ✅ GET /api/students/search-tutors
router.get("/search-tutors", async (req, res) => {
  try {
    const { subject, teachingMode, priceMin, priceMax, availability, rating } = req.query;

    const query = {};

    // 🎯 Subject filter
    if (subject) {
      query.subjects = { $in: [subject] };
    }

    // 🎯 Teaching mode (online/in-person/both)
    if (teachingMode) {
      query.teachingMode = new RegExp(teachingMode, "i"); // Case-insensitive
    }

    // 🎯 Price range
    if (priceMin || priceMax) {
      query.hourlyRate = {};
      if (priceMin) query.hourlyRate.$gte = parseInt(priceMin);
      if (priceMax) query.hourlyRate.$lte = parseInt(priceMax);
    }

    // 🎯 Availability (match day name)
    if (availability) {
      query.availability = {
        $elemMatch: {
          day: { $regex: availability, $options: "i" },
        },
      };
    }

    // 🎯 Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // ✅ Populate user info (city, email, name)
    const tutors = await Tutor.find(query).populate("user", "name email city");

    res.json(tutors);
  } catch (err) {
    console.error("❌ Error in /search-tutors:", err);
    res.status(500).json({ message: "Error fetching tutors", error: err.message });
  }
});

module.exports = router;
