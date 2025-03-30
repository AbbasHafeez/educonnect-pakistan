const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Tutor = require("../models/Tutor");
const User = require("../models/User");
const Session = require("../models/Session");
const Wishlist = require("../models/Wishlist");
const Notification = require("../models/Notification");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// 📦 Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/tutors/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/**
 * ✅ GET /api/tutor/dashboard
 * Tutor dashboard data
 */
router.get("/dashboard", authMiddleware, authorizeRoles("tutor"), async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user.id }).populate("user", "name email role");
    if (!tutor) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }
    res.json({ tutor });
  } catch (error) {
    console.error("🔥 Error fetching tutor dashboard:", error.message);
    res.status(500).json({ message: "Error fetching tutor data", error: error.message });
  }
});

/**
 * ✅ PUT /api/tutor/profile
 * Update tutor profile and notify students on rate drop
 */
router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("tutor"),
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        qualifications,
        bio,
        subjects,
        hourlyRate,
        availability,
        teachingMode,
      } = req.body;

      const parsedSubjects = JSON.parse(subjects || "[]");
      const parsedAvailability = JSON.parse(availability || "[]");

      const updatedFields = {
        qualifications,
        bio,
        subjects: parsedSubjects,
        hourlyRate,
        availability: parsedAvailability,
        teachingMode,
      };

      if (req.file) {
        updatedFields.profileImage = `/uploads/tutors/${req.file.filename}`;
      }

      const tutor = await Tutor.findOne({ user: req.user.id });
      if (!tutor) return res.status(404).json({ message: "Tutor not found" });

      // 💡 Check for hourlyRate drop
      const oldRate = tutor.hourlyRate;
      const newRate = parseFloat(hourlyRate);
      const rateDropped = oldRate && newRate && newRate < oldRate;

      // ✅ Apply updates
      Object.assign(tutor, updatedFields);
      await tutor.save();

      // ✅ Update user info
      await User.findByIdAndUpdate(req.user.id, { name, email });

      // 🔔 Notify students if rate dropped
      if (rateDropped) {
        const tutorId = tutor._id;
        const tutorName = name || tutor.user?.name || "A tutor";

        const sessionStudents = await Session.find({ tutor: tutorId }).distinct("student");
        const wishlistStudents = await Wishlist.find({ tutor: tutorId }).distinct("student");

        const uniqueStudentIds = [...new Set([...sessionStudents, ...wishlistStudents])];

        const notifications = uniqueStudentIds.map((studentId) => ({
          student: studentId,
          tutor: tutorId, // ✅ Add tutor reference
          message: `📉 ${tutorName} has reduced their hourly rate to Rs. ${newRate}`,
        }));
        

        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
          console.log(`📨 Notified ${notifications.length} student(s) about rate change.`);
        }
      }

      res.json({ message: "Tutor profile updated successfully!", tutor });
    } catch (error) {
      console.error("🔥 Error updating tutor profile:", error.message);
      res.status(500).json({ message: "Error updating profile", error: error.message });
    }
  }
);

/**
 * ✅ GET /api/tutor/:id
 * Fetch tutor by ID (for booking or review)
 */
router.get("/:id", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).populate("user", "name email city");
    if (!tutor) return res.status(404).json({ message: "Tutor not found." });

    res.json({ tutor });
  } catch (error) {
    console.error("🔥 Error fetching tutor by ID:", error.message);
    res.status(500).json({ message: "Error fetching tutor", error: error.message });
  }
});

module.exports = router;
