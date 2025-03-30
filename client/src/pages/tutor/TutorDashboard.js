import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "../../style/Profile.css";

const TutorDashboard = () => {
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const res = await api.get("/tutor/dashboard");
        setTutor(res.data.tutor);

        if (res.data.tutor?._id) {
          const reviewRes = await api.get(`/reviews/tutor/${res.data.tutor._id}`);
          setReviews(reviewRes.data);
        }
      } catch (err) {
        console.error("❌ Error fetching tutor info:", err);
        setError("Failed to load tutor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorProfile();
  }, []);

  if (loading) return <p>Loading tutor data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tutor-page">
      <div className="profile-container display">
        <img
          src={
            tutor?.profileImage
              ? `http://localhost:5000${tutor.profileImage}`
              : "/images/default-profile.png" // ✅ Use local default image
          }
          alt="Tutor Profile"
          className="profile-image"
        />

        <div className="profile-info">
          <h1>Welcome, {tutor?.user?.name || "Tutor"}!</h1>
          <p><strong>Email:</strong> {tutor?.user?.email}</p>
          <p><strong>Qualifications:</strong> {tutor?.qualifications || "N/A"}</p>
          <p><strong>Bio:</strong> {tutor?.bio || "N/A"}</p>
          <p><strong>Subjects:</strong> {tutor?.subjects?.join(", ") || "N/A"}</p>
          <p><strong>Hourly Rate:</strong> Rs. {tutor?.hourlyRate}</p>
          <p><strong>Teaching Mode:</strong> {tutor?.teachingMode}</p>
          <p><strong>Verification:</strong> {tutor?.verificationStatus}</p>
          <p><strong>City:</strong> {tutor?.city || "N/A"}</p>

          <div className="availability-section">
            <strong>Availability:</strong>
            {tutor?.availability?.length > 0 ? (
              <ul className="availability-list">
                {tutor.availability.map((daySlot) => (
                  <li key={daySlot.day}>
                    <strong>{daySlot.day}:</strong>{" "}
                    {daySlot.timeSlots.length > 0
                      ? daySlot.timeSlots.join(", ")
                      : "No slots"}
                  </li>
                ))}
              </ul>
            ) : (
              <p><i>No availability set</i></p>
            )}
          </div>

          <div className="dashboard-buttons">
            <Link to="/tutor/profile" className="dashboard-btn btn-blue">Manage Profile</Link>
            <Link to="/tutor/sessions" className="dashboard-btn btn-cyan">View Sessions</Link>
            <Link to="/tutor/earnings" className="dashboard-btn btn-green">View Earnings</Link>
          </div>
        </div>
      </div>

      {/* 🌟 Reviews Section (Styled via Profile.css) */}
      <div className="reviews-section">
        <h2>🌟 Student Reviews</h2>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews submitted yet.</p>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <strong>{review.student?.name || "Student"}</strong>
                  <span className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "star-filled" : "star-empty"}>★</span>
                    ))}
                  </span>
                </div>
                <p className="review-comment">
                  {review.comment || <i>No comment provided.</i>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;
