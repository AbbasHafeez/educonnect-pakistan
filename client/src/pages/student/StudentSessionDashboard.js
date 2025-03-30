// client/src/pages/student/StudentSessionDashboard.js

import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentSessionDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // For rescheduling
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions/student"); // GET /api/sessions/student
        setSessions(res.data);
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
        setMessage("Failed to load your sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      return alert("Please fill date and time for reschedule.");
    }
    try {
      const res = await api.put(`/sessions/${rescheduleId}/reschedule`, {
        newDate,
        newTime,
      });
      setMessage(res.data.message);
      // update local state
      setSessions((prev) =>
        prev.map((s) => (s._id === rescheduleId ? { ...s, ...res.data.session } : s))
      );
      // reset
      setRescheduleId(null);
      setNewDate("");
      setNewTime("");
    } catch (err) {
      console.error("❌ Reschedule error:", err);
      alert(err.response?.data?.message || "Failed to reschedule");
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel this session?")) return;
    try {
      const res = await api.delete(`/sessions/${sessionId}`);
      setMessage(res.data.message);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (err) {
      console.error("❌ Cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel session");
    }
  };

  // optional: separate upcoming/past
  const now = new Date();
  const upcoming = sessions.filter((s) => new Date(s.date) >= now);
  const past = sessions.filter((s) => new Date(s.date) < now);

  if (loading) return <p>Loading your sessions...</p>;

  return (
    <div>
      <h1>🎓 Your Sessions</h1>
      {message && <p>{message}</p>}

      {/* OPTIONAL: upcoming / past separation */}
      <section>
        <h2>Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <p>No upcoming sessions</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tutor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((s) => (
                <tr key={s._id}>
                  <td>{s.tutor?.user?.name || "N/A"}</td>
                  <td>{new Date(s.date).toLocaleDateString()}</td>
                  <td>{s.time}</td>
                  <td>{s.mode}</td>
                  <td>{s.status}</td>
                  <td>
                    <button onClick={() => setRescheduleId(s._id)}>Reschedule</button>
                    <button onClick={() => handleCancel(s._id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Past Sessions</h2>
        {past.length === 0 ? (
          <p>No past sessions</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tutor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Status</th>
                {/* ✅ NEW: Add 'Actions' column for past sessions */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {past.map((s) => (
                <tr key={s._id}>
                  <td>{s.tutor?.user?.name || "N/A"}</td>
                  <td>{new Date(s.date).toLocaleDateString()}</td>
                  <td>{s.time}</td>
                  <td>{s.mode}</td>
                  <td>{s.status}</td>
                  {/* ✅ NEW: 'Delete' button calls handleCancel */}
                  <td>
                    <button onClick={() => handleCancel(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Reschedule Form */}
      {rescheduleId && (
        <div className="reschedule-modal">
          <h2>Reschedule Session</h2>
          <form onSubmit={handleReschedule}>
            <label>New Date:</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <label>New Time:</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />

            <button type="submit">Confirm</button>
            <button type="button" onClick={() => setRescheduleId(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentSessionDashboard;
