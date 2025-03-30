const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// Add to wishlist
router.post("/", authMiddleware, authorizeRoles("student"), async (req, res) => {
  const { tutorId } = req.body;
  const studentId = req.user.id;
  const exists = await Wishlist.findOne({ student: studentId, tutor: tutorId });

  if (exists) return res.status(400).json({ message: "Already in wishlist" });

  const entry = await Wishlist.create({ student: studentId, tutor: tutorId });
  res.status(201).json(entry);
});

// Get all wishlist tutors
// Get all wishlist tutors with nested user data
router.get("/", authMiddleware, authorizeRoles("student"), async (req, res) => {
    try {
      const studentId = req.user.id;
  
      const list = await Wishlist.find({ student: studentId }).populate({
        path: "tutor",
        populate: { path: "user", select: "name city" }
      });
  
      res.json(list);
    } catch (err) {
      console.error("❌ Error loading wishlist:", err);
      res.status(500).json({ message: "Failed to load wishlist" });
    }
  });
  

// Remove from wishlist
router.delete("/:tutorId", authMiddleware, authorizeRoles("student"), async (req, res) => {
  const studentId = req.user.id;
  await Wishlist.findOneAndDelete({ student: studentId, tutor: req.params.tutorId });
  res.json({ message: "Removed from wishlist" });
});

module.exports = router;
