// client/src/pages/tutor/SessionDashboard.js

import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "../../style/SessionDashboard.css";

const SessionDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions/tutor");
        setSessions(res.data);
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
        setMessage("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/sessions/${id}/status`, { status });
      setSessions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, ...res.data.session } : s))
      );
      setMessage(`✅ Session marked as ${status}`);
    } catch (err) {
      console.error("❌ Failed to update session:", err);
      setMessage("Failed to update session.");
    }
  };

  if (loading) return <p>Loading sessions...</p>;

  return (
    <div className="session-dashboard">
      <h2>📅 Your Sessions</h2>
      {message && <p className="session-message">{message}</p>}

      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <table className="session-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Earnings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td>{s.student?.name || "N/A"}</td>
                <td>{new Date(s.date).toLocaleDateString()}</td>
                <td>{s.time}</td>
                <td>{s.status}</td>
                <td>Rs. {s.earning || 0}</td>
                <td>
                  {s.status === "pending" && (
                    <>
                      <button onClick={() => handleStatusChange(s._id, "accepted")}>
                        ✅ Accept
                      </button>
                      <button onClick={() => handleStatusChange(s._id, "declined")}>
                        ❌ Decline
                      </button>
                    </>
                  )}
                  {s.status === "accepted" && (
                    <button onClick={() => handleStatusChange(s._id, "completed")}>
                      ✔️ Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SessionDashboard;
