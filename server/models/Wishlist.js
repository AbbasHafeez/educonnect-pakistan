const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
