import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // Helper for API requests

const Login = () => {
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("🔍 Sending login request:", formData);
      const response = await api.post("/auth/login", formData);
      console.log("✅ Login success:", response.data);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      login({ token, role: user.role });

      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "tutor") navigate("/tutor/dashboard");
      else if (user.role === "admin") navigate("/admin/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
