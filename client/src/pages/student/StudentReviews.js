// client/src/pages/student/StudentReviews.js

import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "../../style/StudentReviews.css"; // optional styling

const StudentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedRating, setEditedRating] = useState(5);
  const [editedComment, setEditedComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews/my");
      setReviews(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch reviews:", err);
      setMessage("Error loading reviews.");
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedRating(5);
    setEditedComment("");
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/reviews/${id}`, {
        rating: editedRating,
        comment: editedComment,
      });
      setMessage("Review updated.");
      cancelEdit();
      fetchReviews();
    } catch (err) {
      console.error("❌ Update error:", err);
      setMessage("Failed to update review.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setMessage("Review deleted.");
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage("Failed to delete review.");
    }
  };

  return (
    <div className="student-reviews">
      <h2>📝 My Reviews</h2>
      {message && <p>{message}</p>}

      {reviews.length === 0 ? (
        <p>You haven't submitted any reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((r) => (
            <li key={r._id} className="review-item">
              <p><strong>Tutor:</strong> {r.tutor?.user?.name || "N/A"}</p>
              <p><strong>Date:</strong> {new Date(r.session?.date).toLocaleDateString()} at {r.session?.time}</p>
              {editingId === r._id ? (
                <div>
                  <label>Rating:
                    <select value={editedRating} onChange={(e) => setEditedRating(e.target.value)}>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                  <br />
                  <label>Comment:
                    <textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                  </label>
                  <br />
                  <button onClick={() => handleUpdate(r._id)}>✅ Save</button>
                  <button onClick={cancelEdit}>❌ Cancel</button>
                </div>
              ) : (
                <>
                  <p><strong>Rating:</strong> ⭐ {r.rating}</p>
                  <p><strong>Comment:</strong> {r.comment || "(No comment)"}</p>
                  <button onClick={() => startEdit(r)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(r._id)}>🗑️ Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentReviews;
