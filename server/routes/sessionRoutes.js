// server/routes/sessionRoutes.js

const express = require("express");
const router = express.Router();
const Session = require("../models/Session"); // Session model
const Tutor = require("../models/Tutor");     // Tutor model
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

/**
 * POST /api/sessions/book
 * Book a new tutoring session (STUDENT)
 */
router.post(
  "/book",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { tutorId, date, time, mode } = req.body;
      const studentId = req.user.id;

      if (!tutorId || !date || !time || !mode) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const tutorDoc = await Tutor.findById(tutorId);
      if (!tutorDoc) {
        return res.status(404).json({ message: "Tutor not found." });
      }

      const dateObj = new Date(date);
      const dayOfWeek = dateObj
        .toLocaleDateString("en-us", { weekday: "long" })
        .toLowerCase();

      // Ensure the tutor is actually available that day/time
      const isAvailable = tutorDoc.availability.some((dayItem) => {
        const dayName = dayItem.day.toLowerCase();
        return dayName === dayOfWeek && dayItem.timeSlots.includes(time);
      });
      if (!isAvailable) {
        return res
          .status(400)
          .json({ message: "Tutor is not available at that date/time." });
      }

      // Prevent double-booking
      const existingSession = await Session.findOne({
        tutor: tutorId,
        date,
        time,
        status: { $in: ["pending", "confirmed"] },
      });
      if (existingSession) {
        return res
          .status(400)
          .json({ message: "That time slot is already booked." });
      }

      // Create new session doc
      const newSession = new Session({
        tutor: tutorId,
        student: studentId,
        date,
        time,
        mode,
        status: "pending",
        earning: 0, // set on completion
      });

      await newSession.save();
      return res.status(201).json({
        message: "✅ Session booked successfully!",
        session: newSession,
      });
    } catch (error) {
      console.error("❌ Booking error:", error);
      return res.status(500).json({
        message: "Booking failed",
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/sessions/tutor
 * Fetch sessions for the logged-in tutor (TUTOR)
 */
router.get(
  "/tutor",
  authMiddleware,
  authorizeRoles("tutor"),
  async (req, res) => {
    try {
      const tutorDoc = await Tutor.findOne({ user: req.user.id });
      if (!tutorDoc) {
        return res
          .status(404)
          .json({ message: "No Tutor doc found for this user." });
      }

      const sessions = await Session.find({ tutor: tutorDoc._id })
        .populate("student", "name email")
        .populate("tutor", "subjects hourlyRate");

      res.json(sessions);
    } catch (error) {
      console.error("❌ Error fetching tutor sessions:", error);
      res
        .status(500)
        .json({ message: "Error fetching sessions", error: error.message });
    }
  }
);

/**
 * PUT /api/sessions/:id/status
 * Update a session's status by tutor (accepted/declined/completed)
 */
router.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles("tutor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const tutorDoc = await Tutor.findOne({ user: req.user.id });
      if (!tutorDoc) {
        return res
          .status(404)
          .json({ message: "Tutor doc not found for user." });
      }

      const session = await Session.findOne({
        _id: id,
        tutor: tutorDoc._id,
      }).populate("tutor");

      if (!session) {
        return res
          .status(404)
          .json({ message: "Session not found or unauthorized" });
      }

      // If marking completed, compute earning
      if (status === "completed") {
        session.earning = session.tutor.hourlyRate; 
      }

      session.status = status;
      await session.save();

      return res.json({
        message: `Session status updated to ${status}`,
        session,
      });
    } catch (error) {
      console.error("❌ Failed to update session:", error);
      res
        .status(500)
        .json({ message: "Error updating session", error: error.message });
    }
  }
);

/**
 * GET /api/sessions/earnings
 * Provides weekly/monthly earnings summary for the logged-in tutor
 */
router.get(
  "/earnings",
  authMiddleware,
  authorizeRoles("tutor"),
  async (req, res) => {
    try {
      const tutorDoc = await Tutor.findOne({ user: req.user.id });
      if (!tutorDoc) {
        return res.status(404).json({ message: "No Tutor doc found for this user." });
      }

      const completed = await Session.find({
        tutor: tutorDoc._id,
        status: "completed",
      });

      const earnings = completed.map((s) => ({
        date: s.date,
        amount: s.earning || 0,
      }));

      const weeklyTotals = {};
      const monthlyTotals = {};

      earnings.forEach((entry) => {
        const date = new Date(entry.date);
        const week = `Week-${getISOWeekNumber(date)}`;
        const month = date.toLocaleString("default", { month: "long" });

        weeklyTotals[week] = (weeklyTotals[week] || 0) + entry.amount;
        monthlyTotals[month] = (monthlyTotals[month] || 0) + entry.amount;
      });

      res.json({ weekly: weeklyTotals, monthly: monthlyTotals });
    } catch (error) {
      console.error("❌ Error fetching earnings summary:", error);
      res
        .status(500)
        .json({ message: "Error fetching earnings summary", error: error.message });
    }
  }
);

/**
 * GET /api/sessions/student
 * Fetch sessions for the logged-in student
 */
router.get(
  "/student",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const studentId = req.user.id;

      // Sessions where student == studentId
      const sessions = await Session.find({ student: studentId })
        .populate("tutor")                       // so we can see tutor info
        .populate({ path: "tutor", populate: { path: "user", select: "name email city" } });

      res.json(sessions);
    } catch (error) {
      console.error("❌ Error fetching student sessions:", error);
      res.status(500).json({ message: "Failed to load sessions", error: error.message });
    }
  }
);

/**
 * PUT /api/sessions/:id/reschedule
 * Student reschedules date/time
 */
router.put(
  "/:id/reschedule",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newDate, newTime } = req.body;

      if (!newDate || !newTime) {
        return res
          .status(400)
          .json({ message: "All fields required (newDate, newTime)" });
      }

      // Must ensure session belongs to logged-in student
      const session = await Session.findOne({
        _id: id,
        student: req.user.id,
      }).populate("tutor");

      if (!session) {
        return res
          .status(404)
          .json({ message: "Session not found or unauthorized." });
      }

      // Check tutor's availability for the newDate/newTime
      const dateObj = new Date(newDate);
      const dayOfWeek = dateObj
        .toLocaleDateString("en-us", { weekday: "long" })
        .toLowerCase();

      const tutorDoc = session.tutor;
      const isAvailable = tutorDoc.availability.some((dayItem) => {
        const dayName = dayItem.day.toLowerCase();
        return dayName === dayOfWeek && dayItem.timeSlots.includes(newTime);
      });

      if (!isAvailable) {
        return res
          .status(400)
          .json({ message: "Tutor not available at that new date/time" });
      }

      // Also check for double-booking
      const existing = await Session.findOne({
        tutor: tutorDoc._id,
        date: newDate,
        time: newTime,
        status: { $in: ["pending", "confirmed"] },
        _id: { $ne: session._id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "That slot is already taken." });
      }

      // Reschedule
      session.date = newDate;
      session.time = newTime;
      session.status = "pending"; // revert to pending if you like
      await session.save();

      res.json({
        message: "Session rescheduled successfully",
        session,
      });
    } catch (error) {
      console.error("❌ Error rescheduling session:", error);
      res
        .status(500)
        .json({ message: "Failed to reschedule session", error: error.message });
    }
  }
);

/**
 * DELETE /api/sessions/:id
 * Student cancels a session
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const session = await Session.findOneAndDelete({
        _id: req.params.id,
        student: req.user.id,
      });
      if (!session) {
        return res
          .status(404)
          .json({ message: "Session not found or unauthorized" });
      }
      res.json({ message: "Session cancelled successfully" });
    } catch (error) {
      console.error("❌ Error deleting session:", error);
      res
        .status(500)
        .json({ message: "Failed to cancel session", error: error.message });
    }
  }
);

// Helper: ISO Week Number
function getISOWeekNumber(date) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = router;
