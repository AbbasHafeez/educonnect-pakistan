import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    // Load user from localStorage on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedRole = localStorage.getItem("role");

        if (storedUser && storedRole) {
            setUser(storedUser);
            setRole(storedRole);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.role);
        setUser(userData);
        setRole(userData.role);

        // Redirect based on role
        if (userData.role === "student") {
            navigate("/student/dashboard");
        } else if (userData.role === "tutor") {
            navigate("/tutor/dashboard");
        } else if (userData.role === "admin") {
            navigate("/admin/dashboard");
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setRole(null);
        navigate("/"); // Redirect to home after logout
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Custom Hook to access Auth Context
export const useAuth = () => useContext(AuthContext);
