const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Session = require("../models/Session");
const Tutor = require("../models/Tutor");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

/**
 * POST /api/reviews
 * Submit a review for a tutor (student only)
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { tutorId, rating, comment } = req.body;
      const studentId = req.user.id;

      if (!tutorId || !rating) {
        return res.status(400).json({ message: "TutorId and rating are required." });
      }

      const completedSession = await Session.findOne({
        tutor: tutorId,
        student: studentId,
        status: "completed",
      });

      if (!completedSession) {
        return res.status(400).json({ message: "You can only review after a completed session." });
      }

      const newReview = new Review({
        tutor: tutorId,
        student: studentId,
        session: completedSession._id,
        rating,
        comment,
      });

      await newReview.save();

      const allReviews = await Review.find({ tutor: tutorId });
      const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

      await Tutor.findByIdAndUpdate(tutorId, {
        rating: avg,
        numReviews: allReviews.length,
      });

      return res.status(201).json({ message: "Review submitted!", review: newReview });
    } catch (error) {
      console.error("❌ Review error:", error);
      return res.status(500).json({ message: "Failed to submit review", error: error.message });
    }
  }
);

/**
 * GET /api/reviews/tutor/:tutorId
 * Fetch reviews for a given tutor
 */
router.get("/tutor/:tutorId", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const reviews = await Review.find({ tutor: tutorId })
      .populate("student", "name email");

    return res.json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
});

/**
 * PUT /api/reviews/:id
 * Edit a student's review
 */
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const studentId = req.user.id;

    try {
      const review = await Review.findOneAndUpdate(
        { _id: id, student: studentId },
        { rating, comment },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ message: "Review not found or unauthorized." });
      }

      const allReviews = await Review.find({ tutor: review.tutor });
      const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

      await Tutor.findByIdAndUpdate(review.tutor, {
        rating: avg,
        numReviews: allReviews.length,
      });

      return res.json({ message: "Review updated!", review });
    } catch (err) {
      console.error("❌ Error updating review:", err);
      res.status(500).json({ message: "Failed to update review", error: err.message });
    }
  }
);

/**
 * DELETE /api/reviews/:id
 * Delete a student's review
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    const { id } = req.params;
    const studentId = req.user.id;

    try {
      const review = await Review.findOneAndDelete({ _id: id, student: studentId });

      if (!review) {
        return res.status(404).json({ message: "Review not found or unauthorized." });
      }

      const allReviews = await Review.find({ tutor: review.tutor });
      const avg =
        allReviews.length > 0
          ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
          : 0;

      await Tutor.findByIdAndUpdate(review.tutor, {
        rating: avg,
        numReviews: allReviews.length,
      });

      return res.json({ message: "Review deleted successfully!" });
    } catch (err) {
      console.error("❌ Error deleting review:", err);
      res.status(500).json({ message: "Failed to delete review", error: err.message });
    }
  }
);

/**
 * GET /api/reviews/my
 * Get all reviews by the logged-in student
 */
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const reviews = await Review.find({ student: req.user.id })
        .populate({
          path: "tutor",
          populate: { path: "user", select: "name email" },
        })
        .populate("session", "date time");

      res.json(reviews);
    } catch (err) {
      console.error("❌ Error fetching student reviews:", err);
      res.status(500).json({ message: "Failed to fetch your reviews" });
    }
  }
);

module.exports = router;
