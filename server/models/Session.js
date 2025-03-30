// models/Session.js

const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ["online", "in-person"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "completed"],
    default: "pending",
  },
  earning: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
