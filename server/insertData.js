const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/educonnect", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Sample users
const users = [
  { name: "Admin User", email: "admin@example.com", password: "hashedpassword123", role: "admin", isVerified: true },
  { name: "John Doe", email: "john@example.com", password: "hashedpassword456", role: "student", isVerified: true },
  { name: "Jane Smith", email: "jane@example.com", password: "hashedpassword789", role: "tutor", isVerified: false },
];

// Insert data
const insertData = async () => {
  try {
    await User.deleteMany(); // Clears existing data
    await User.insertMany(users);
    console.log("Sample data inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data:", error);
    mongoose.connection.close();
  }
};

insertData();
