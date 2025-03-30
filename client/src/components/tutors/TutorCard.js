// client/src/components/admin/TutorVerificationCard.js
import React from "react";

const TutorVerificationCard = ({ tutor }) => {
  return (
    <div className="tutor-verification-card">
      <h3>{tutor.name}</h3>
      <p>Email: {tutor.email}</p>
      <p>Status: {tutor.verified ? "Verified" : "Pending"}</p>
    </div>
  );
};

export default TutorVerificationCard;
