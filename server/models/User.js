const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      required: true
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    city: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
