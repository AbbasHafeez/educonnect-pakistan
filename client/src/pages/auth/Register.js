import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../utils/api";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            await registerUser(formData);
            setMessage("✅ Registration successful! Please log in.");
            setFormData({ name: "", email: "", password: "", role: "student" });
        } catch (err) {
            setError(err.response?.data?.msg || "❌ Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Register</h2>
                {message && <p className="success-msg">{message}</p>}
                {error && <p className="error-msg">{error}</p>}

                <form className="auth-form" onSubmit={handleRegister}>
                    <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    
                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <span onClick={() => navigate("/login")}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
