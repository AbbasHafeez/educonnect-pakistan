// Fetch tutor's sessions
exports.getTutorSessions = async (req, res) => {
    try {
      const sessions = await Session.find({ tutor: req.user._id }).populate("student", "name email");
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ message: "Error fetching sessions", error: err.message });
    }
  };
  
  // Update status (e.g. completed)
  exports.updateSessionStatus = async (req, res) => {
    const { sessionId } = req.params;
    const { status } = req.body;
  
    try {
      const session = await Session.findOneAndUpdate(
        { _id: sessionId, tutor: req.user._id },
        { status },
        { new: true }
      );
      if (!session) return res.status(404).json({ message: "Session not found" });
      res.json({ message: "Session status updated", session });
    } catch (err) {
      res.status(500).json({ message: "Failed to update session", error: err.message });
    }
  };
  