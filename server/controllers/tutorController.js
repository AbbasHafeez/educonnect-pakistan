const Tutor = require("../models/Tutor");
const User = require("../models/User");
const path = require("path");

// Get current tutor profile
exports.getTutorProfile = async (req, res) => {
  try {
    const profile = await Tutor.findOne({ user: req.user.id }).populate("user", "name email");
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update tutor profile
exports.updateTutorProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const updated = await Tutor.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
