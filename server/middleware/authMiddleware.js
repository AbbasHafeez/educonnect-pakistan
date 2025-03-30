const jwt = require("jsonwebtoken");

// 🛡️ Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("🛡️ Checking Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing or malformed token in request header.");
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified. Decoded payload:", decoded);
    req.user = decoded; // where decoded = jwt.verify(...)

    next();
  } catch (err) {
    console.error("❌ Invalid or expired token:", err.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// 🔐 Middleware for Role-Based Access Control
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("🔐 Authorizing role. Required:", roles, "| User role:", req.user?.role);

    if (!roles.includes(req.user.role)) {
      console.log(`⛔ Access denied: Role '${req.user.role}' is not authorized.`);
      return res.status(403).json({ msg: "Access denied: Unauthorized role" });
    }

    console.log("✅ Role authorized:", req.user.role);
    next();
  };
};

module.exports = {
  authMiddleware,
  authorizeRoles,
};
