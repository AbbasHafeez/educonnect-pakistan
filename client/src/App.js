import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";

// Auth Pages
import StudentAuth from "./pages/auth/StudentAuth";
import TutorAuth from "./pages/auth/TutorAuth";
import AdminLogin from "./pages/auth/AdminLogin";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import TutorSearch from "./pages/student/TutorSearch";
import StudentSessionDashboard from "./pages/student/StudentSessionDashboard";
import ReviewForm from "./pages/student/ReviewForm";
import StudentReviews from "./pages/student/StudentReviews";

// 🆕 Wishlist Page
import WishlistPage from "./pages/student/WishlistPage"; // ✅

 // Tutor Pages
import TutorDashboard from "./pages/tutor/TutorDashboard";
import ProfileManagement from "./pages/tutor/ProfileManagement";
import SessionDashboard from "./pages/tutor/SessionDashboard";
import EarningsChart from "./pages/tutor/EarningsChart";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import TutorVerification from "./pages/admin/TutorVerification";

// Booking
import BookSession from "./pages/student/BookSession";

// Utility
import PrivateRoute from "./utils/PrivateRoute";
import "./App.css";

function App() {
  const location = useLocation();
  console.log("🔵 App.js Rendered. Current route:", location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/student/auth" element={<StudentAuth />} />
        <Route path="/tutor/auth" element={<TutorAuth />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ---------- Student Routes ---------- */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/search"
          element={
            <PrivateRoute role="student">
              <TutorSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/book-session/:tutorId"
          element={
            <PrivateRoute role="student">
              <BookSession />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/sessions"
          element={
            <PrivateRoute role="student">
              <StudentSessionDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/review/:tutorId"
          element={
            <PrivateRoute role="student">
              <ReviewForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/reviews"
          element={
            <PrivateRoute role="student">
              <StudentReviews />
            </PrivateRoute>
          }
        />
        {/* ✅ Wishlist Route */}
        <Route
          path="/student/wishlist"
          element={
            <PrivateRoute role="student">
              <WishlistPage />
            </PrivateRoute>
          }
        />

        {/* ---------- Tutor Routes ---------- */}
        <Route
          path="/tutor/dashboard"
          element={
            <PrivateRoute role="tutor">
              <TutorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tutor/profile"
          element={
            <PrivateRoute role="tutor">
              <ProfileManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/tutor/sessions"
          element={
            <PrivateRoute role="tutor">
              <SessionDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tutor/earnings"
          element={
            <PrivateRoute role="tutor">
              <EarningsChart />
            </PrivateRoute>
          }
        />

        {/* ---------- Admin Routes ---------- */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tutor-verification"
          element={
            <PrivateRoute role="admin">
              <TutorVerification />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
