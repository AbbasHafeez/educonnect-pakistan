import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "../../style/StudentDashboard.css";

const StudentDashboard = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
    }
  };

  return (
    <div className="student-dashboard">
      <h1>🎓 Student Dashboard</h1>
      <p>Welcome! Here you can search for tutors, book sessions, manage your learning, and save your favorites!</p>

      <div className="student-actions">
        <Link to="/student/search" className="dashboard-button">🔍 Find Tutors</Link>
        <Link to="/student/sessions" className="dashboard-button">📅 Manage Sessions</Link>
        <Link to="/student/reviews" className="dashboard-button">✍️ My Reviews</Link>
        <Link to="/student/wishlist" className="dashboard-button">❤️ My Wishlist</Link>
      </div>

      {/* ✅ Notifications Section */}
      <div className="notification-box">
        <h3>🔔 Notifications</h3>
        {notifications.length === 0 ? (
          <p>No new notifications.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li key={n._id} className="notification-item">
                📉 {n.message}
                <button
                  className="delete-button"
                  onClick={() => deleteNotification(n._id)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
