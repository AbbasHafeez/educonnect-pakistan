const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Admin Dashboard Stats Route
router.get("/stats", authMiddleware, authorizeRoles('admin'), adminController.getAdminStats);
// Tutor Verification Routes
router.get("/tutors/pending", authMiddleware, authorizeRoles('admin'), adminController.getPendingTutors);
router.put("/tutor/verify/:tutorId", authMiddleware, authorizeRoles('admin'), adminController.verifyTutor);

// Admin Reporting Dashboard Route
router.get("/reports", authMiddleware, authorizeRoles('admin'), adminController.getReports);

router.get("/tutors/all", authMiddleware, authorizeRoles('admin'), adminController.getAllTutors);


module.exports = router;
