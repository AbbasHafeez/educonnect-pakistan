const Tutor = require("../models/Tutor");
const User = require("../models/User");
const Session = require("../models/Session");

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalTutors = await Tutor.countDocuments();
    const pendingVerifications = await Tutor.countDocuments({ verificationStatus: "pending" });
    const verifiedTutors = await Tutor.countDocuments({ verificationStatus: "approved" });
    const rejectedTutors = await Tutor.countDocuments({ verificationStatus: "rejected" });
    const totalStudents = await User.countDocuments({ role: "student" });

    res.status(200).json({ totalTutors, pendingVerifications, verifiedTutors, rejectedTutors, totalStudents });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// Get all tutors with their verification status and user info
exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find().populate("user", "name email");
    res.status(200).json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: "Error fetching tutors", error: error.message });
  }
};

// Get all pending tutors (include user info)
exports.getPendingTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ verificationStatus: "pending" })
      .populate("user", "name email"); // ✅ Populating user name & email
    res.status(200).json(tutors);
  } catch (error) {
    console.error("Error fetching pending tutors:", error);
    res.status(500).json({ message: "Error fetching pending tutors", error: error.message });
  }
};

// Approve or reject tutor verification (return user info too)
exports.verifyTutor = async (req, res) => {
  const { status, comment } = req.body;
  const { tutorId } = req.params;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid verification status. Status must be 'approved' or 'rejected'." });
  }

  try {
    const tutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { verificationStatus: status, verificationComment: comment },
      { new: true }
    ).populate("user", "name email"); // ✅ Ensuring frontend gets updated user data

    if (!tutor) {
      return res.status(404).json({ message: `Tutor with ID ${tutorId} not found` });
    }

    res.status(200).json({ message: `Tutor ${status} successfully`, tutor });
  } catch (error) {
    console.error("Error updating tutor verification:", error);
    res.status(500).json({ message: "Error updating tutor verification", error: error.message });
  }
};

// Fetch report data for the Admin Dashboard
// Fetch report data for the Admin Dashboard (supports optional date filtering)
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Create filter object if date filters exist
    const dateFilter = {};
    if (startDate) dateFilter.createdAt = { ...dateFilter.createdAt, $gte: new Date(startDate) };
    if (endDate) dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };

    // Subjects
    const subjectStats = await Tutor.aggregate([
      { $unwind: "$subjects" },
      { $group: { _id: "$subjects", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Sessions
    const totalSessions = await Session.countDocuments(dateFilter);
    const completedSessions = await Session.countDocuments({
      ...dateFilter,
      status: "completed",
    });
    const sessionCompletionRate = totalSessions ? (completedSessions / totalSessions) * 100 : 0;

    // Users by city
    const userStats = await User.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // User growth
    const userGrowth = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      subjectStats: subjectStats.length ? subjectStats : [],
      sessionCompletionRate,
      userStats: userStats.length ? userStats : [],
      userGrowth: userGrowth.length ? userGrowth : [],
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};
