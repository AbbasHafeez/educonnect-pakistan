import React, { useState } from "react";
import { useParams } from "react-router-dom";  // ✅ add this
import api from "../../utils/api";

const ReviewForm = () => {
  const { tutorId } = useParams();  // ✅ grab tutorId from URL
  console.log("📌 [ReviewForm] tutorId from params:", tutorId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Submitting review:", { tutorId, rating, comment });

    if (!rating || !tutorId) {
      setMessage("TutorId and rating are required.");
      return;
    }

    try {
      const res = await api.post("/reviews", {
        tutorId,
        rating,
        comment,
      });
      setMessage("✅ Review submitted!");
    } catch (err) {
      console.error("❌ Review submission error:", err);
      setMessage(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div>
      <h2>📝 Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <label>Rating (1-5):</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <label>Comment:</label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit" style={{ marginLeft: "10px", backgroundColor: "green", color: "white", padding: "5px 10px", border: "none" }}>
          Submit Review
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReviewForm;
