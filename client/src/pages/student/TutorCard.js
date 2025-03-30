import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import "../../style/TutorCard.css";

const TutorCard = ({ tutor }) => {
  const {
    user,
    subjects,
    hourlyRate,
    teachingMode,
    profileImage,
    rating,
    numReviews,
    _id,
  } = tutor;

  console.log("[TutorCard] Rendering card for tutor:", tutor);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(_id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(_id);
    } else {
      addToWishlist(tutor);
    }
  };

  const imageUrl =
    profileImage && profileImage !== ""
      ? `http://localhost:5000${profileImage}`
      : "/images/default-profile.png";

  return (
    <div className="tutor-card">
      <img
        src={imageUrl}
        alt="Profile"
        className="tutor-card-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/default-profile.png";
        }}
      />
      <div className="tutor-card-details">
        <h3>{user?.name || "Unnamed Tutor"}</h3>
        <p><strong>Subjects:</strong> {subjects?.join(", ") || "N/A"}</p>
        <p><strong>Rate:</strong> Rs. {hourlyRate || 0}</p>
        <p><strong>Mode:</strong> {teachingMode || "N/A"}</p>
        <p><strong>City:</strong> {user?.city || "N/A"}</p>
        <p>
          <strong>Rating:</strong> ⭐ {rating || "N/A"} ({numReviews || 0} reviews)
        </p>

        <div className="tutor-card-actions">
          <Link to={`/student/book-session/${_id}`} className="book-button">
            Book Now
          </Link>
          <Link to={`/student/review/${_id}`} className="review-button">
            Review
          </Link>
          <button
            className={`wishlist-button ${inWishlist ? "remove" : "add"}`}
            onClick={handleWishlistToggle}
          >
            {inWishlist ? "💔 Remove" : "💖 Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
