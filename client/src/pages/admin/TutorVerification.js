import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "../../style/Admin.css";

const TutorVerification = () => {
  const [allTutors, setAllTutors] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [comments, setComments] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get("/admin/tutors/all");
        setAllTutors(response.data);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setAdminStats(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchTutors();
    fetchStats();
  }, []);

  const handleCommentChange = (tutorId, value) => {
    setComments({ ...comments, [tutorId]: value });
  };

  const handleVerification = async (tutorId, status) => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/admin/tutor/verify/${tutorId}`, {
        status,
        comment: comments[tutorId] || "",
      });

      setAllTutors((prevTutors) =>
        prevTutors.map((tutor) =>
          tutor._id === tutorId
            ? {
                ...tutor,
                verificationStatus: status,
                verificationComment: comments[tutorId] || "",
              }
            : tutor
        )
      );
    } catch (error) {
      setError("Error updating tutor verification.");
      console.error("Error updating tutor verification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Tutor Verification System</h2>

      {adminStats && (
        <div className="admin-stats">
          <div className="stat-box">
            <h4>Pending Verifications</h4>
            <p>{adminStats.pendingVerifications}</p>
          </div>
          <div className="stat-box">
            <h4>Approved Tutors</h4>
            <p>{adminStats.verifiedTutors}</p>
          </div>
          <div className="stat-box">
            <h4>Rejected Tutors</h4>
            <p>{adminStats.rejectedTutors}</p>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label><strong>Filter by Status:</strong> </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <div>
        {allTutors
          .filter((tutor) =>
            filterStatus === "all"
              ? true
              : tutor.verificationStatus === filterStatus
          )
          .map((tutor) => (
            <div key={tutor._id} className="tutor-card">
              <h3>{tutor.user?.name}</h3>
              <p><strong>Email:</strong> {tutor.user?.email}</p>
              <p><strong>Status:</strong> {tutor.verificationStatus}</p>
              <p><strong>Qualifications:</strong> {tutor.qualifications || "N/A"}</p>
              <p><strong>Subjects:</strong> {tutor.subjects?.join(", ") || "N/A"}</p>
              <p><strong>Hourly Rate:</strong> Rs {tutor.hourlyRate}</p>

              {tutor.availability?.length > 0 && (
                <div>
                  <strong>Availability:</strong>
                  <ul>
                    {tutor.availability.map((slot, idx) => (
                      <li key={idx}>
                        {slot.day}: {slot.timeSlots.join(", ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tutor.verificationStatus === "pending" ? (
                <>
                  <textarea
                    placeholder="Add comments"
                    value={comments[tutor._id] || ""}
                    onChange={(e) => handleCommentChange(tutor._id, e.target.value)}
                  />
                  <div>
                    <button
                      onClick={() => handleVerification(tutor._id, "approved")}
                      disabled={loading}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => handleVerification(tutor._id, "rejected")}
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </div>
                </>
              ) : (
                <div className={`status-${tutor.verificationStatus}`}>
                  {tutor.verificationStatus === "approved" ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>✅ Approved</span>
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>❌ Rejected</span>
                  )}
                  {tutor.verificationComment && (
                    <p><em>Comment:</em> {tutor.verificationComment}</p>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TutorVerification;
