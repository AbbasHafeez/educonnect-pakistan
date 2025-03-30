import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // ✅ Import useAuth
import '../../style/Common.css'; // Import the common CSS for styles

const Navbar = () => {
  const { user, role, logout } = useAuth(); // ✅ Get user, role, and logout from useAuth
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // 🔄 Redirect to login after logout
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Home</Link>

      {user ? (
        <>
          {role === "student" && (
            <Link to="/student/dashboard" style={{ marginRight: "15px" }}>
              Student Dashboard
            </Link>
          )}
          {role === "tutor" && (
            <Link to="/tutor/dashboard" style={{ marginRight: "15px" }}>
              Tutor Dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link to="/admin/dashboard" style={{ marginRight: "15px" }}>
              Admin Panel
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="logout" // Add logout class here
            style={{ marginLeft: "15px" }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "15px" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
