// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// Get student's notifications
router.get("/", authMiddleware, authorizeRoles("student"), async (req, res) => {
  const notifications = await Notification.find({ student: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark as read
router.put("/:id/read", authMiddleware, authorizeRoles("student"), async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "Marked as read" });
});

// DELETE a notification
router.delete("/:id", authMiddleware, authorizeRoles("student"), async (req, res) => {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  });
  

module.exports = router;
