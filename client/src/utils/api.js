import axios from "axios";

// ✅ Create Axios Instance with Default Config
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust based on your backend URL
  headers: { "Content-Type": "application/json" }, // Ensure JSON format
});

// ✅ Automatically Attach Auth Token (if available)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to request
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Register User Function
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Registration Error:", error);
    throw error.response?.data || new Error("Registration failed");
  }
};

// ✅ Login User Function (for future use)
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error);
    throw error.response?.data || new Error("Login failed");
  }
};

export default api;
