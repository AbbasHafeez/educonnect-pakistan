import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import "../../assets/css/style.css";

const TutorAuth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login & Register
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = isRegister ? "http://localhost:5000/api/auth/register" : "http://localhost:5000/api/auth/login";
      const body = JSON.stringify(
        isRegister ? { ...formData, role: "tutor" } : { email: formData.email, password: formData.password }
      );

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      console.log("🔍 API Response:", data); // ✅ Debugging API Response

      if (!response.ok) throw new Error(data.msg || "Something went wrong");

      if (!isRegister) {
        // ✅ Login successful - Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login({ email: data.user.email, role: data.user.role, token: data.token });

        // ✅ Redirect user based on role
        navigate("/tutor/dashboard");
      } else {
        // ✅ Registration successful
        alert("Registration successful! Please log in.");
        setIsRegister(false);
      }
    } catch (error) {
      console.error("❌ Login/Register Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isRegister ? "Tutor Register" : "Tutor Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="auth-input" />
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="auth-input" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="auth-input" />
          <button type="submit" className="auth-button" disabled={loading}>{loading ? "Processing..." : isRegister ? "Register" : "Login"}</button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)} className="toggle-link">
            {isRegister ? "Login here" : "Register here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TutorAuth;
