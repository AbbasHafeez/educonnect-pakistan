// models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
