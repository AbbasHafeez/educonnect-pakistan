const User = require("../models/User");
const Tutor = require("../models/Tutor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 🔒 Secure User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("📩 Registration Request:", { name, email, role });

    // ✅ Validate Role
    const validRoles = ["student", "tutor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role specified." });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already registered:", email);
      return res.status(400).json({ msg: "Email already in use" });
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Hashed Password:", hashedPassword);

    // ✅ Save User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    console.log("✅ User created:", newUser._id);

    // ✅ Create Tutor Profile if role is tutor
    if (role === "tutor") {
      const tutorData = {
        user: newUser._id,
        qualifications: "",
        subjects: [],
        hourlyRate: 0,
        availability: [],
        verificationStatus: "pending",
        verificationComment: ""
      };

      console.log("📄 Creating Tutor with data:", tutorData);

      const createdTutor = await Tutor.create(tutorData);

      console.log("✅ Tutor profile created with ID:", createdTutor._id);
    }

    console.log("✅ Registration successful for:", email);
    res.status(201).json({ msg: "User registered successfully" });

  } catch (err) {
    console.error("🚨 Registration error:", err); // Full error, not just message
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔑 Secure User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📩 Incoming Login Request:", email);

    // ✅ Find User
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User Not Found:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 bcrypt.compare() Result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password Mismatch for:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login Successful:", email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("🚨 Login Error:", err); // Full error
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
