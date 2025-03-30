const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  qualifications: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  subjects: {
    type: [String],
    default: []
  },
  hourlyRate: {
    type: Number,
    default: 0,
    min: [0, "Hourly rate must be a positive number"]
  },
  availability: {
    type: [
      {
        day: { type: String },
        timeSlots: [String]
      }
    ],
    default: []
  },
  teachingMode: {
    type: String,
    enum: ["online", "in-person", "both"],
    default: "online"
  },
  profileImage: {
    type: String,
    default: ""
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  verificationComment: {
    type: String,
    default: ""
  },

  // ✅ NEW: Rating Support (Safe Defaults)
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Tutor", TutorSchema);
