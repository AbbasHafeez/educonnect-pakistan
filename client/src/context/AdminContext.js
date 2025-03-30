import { createContext, useState, useEffect } from "react";
import API from "../utils/api";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState({});
  const [pendingTutors, setPendingTutors] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPendingTutors();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const fetchPendingTutors = async () => {
    try {
      const { data } = await API.get("/admin/pending-tutors");
      setPendingTutors(data);
    } catch (error) {
      console.error("Error fetching pending tutors", error);
    }
  };

  const verifyTutor = async (tutorId, status) => {
    try {
      await API.put(`/admin/verify-tutor/${tutorId}`, { status });
      fetchPendingTutors(); // Refresh list after action
    } catch (error) {
      console.error("Error verifying tutor", error);
    }
  };

  return (
    <AdminContext.Provider value={{ stats, pendingTutors, verifyTutor }}>
      {children}
    </AdminContext.Provider>
  );
};
