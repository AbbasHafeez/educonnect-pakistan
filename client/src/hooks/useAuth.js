import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to access authentication context.
 * Ensures that auth-related state and functions are easily accessible.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, role, setUser, setRole, login, logout } = context; // ✅ Add missing setters

  return { user, role, setUser, setRole, login, logout };
};

// ✅ Ensure default export
export default useAuth;
