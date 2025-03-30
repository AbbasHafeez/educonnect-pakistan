import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import "../../assets/css/style.css";  

const AdminLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ For redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // ✅ Save token & user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Update authentication state
      login({ email: data.user.email, role: data.user.role, token: data.token });

      // 🎯 Redirect to Admin Dashboard
      navigate("/admin/dashboard");

    } catch (error) {
      alert(error.message); // 🔴 Show error message
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
