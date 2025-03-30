// client/src/pages/student/BookSessionForm.js

import React, { useState } from "react";
import api from "../../utils/api";

const BookSessionForm = ({ tutor }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("online");
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    if (!date || !time || !mode) {
      return setMessage("Please fill all fields.");
    }

    try {
      await api.post("/sessions/book", {
        tutorId: tutor._id,
        date,
        time,
        mode,
      });
      setMessage("✅ Session booked successfully!");
    } catch (err) {
      console.error("❌ Booking error:", err);
      setMessage(err.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <div className="booking-form">
      <h3>📅 Book Session</h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select value={time} onChange={(e) => setTime(e.target.value)}>
        <option value="">Select Time Slot</option>
        {tutor.availability?.map((day) =>
          day.timeSlots.map((slot) => (
            <option key={`${day.day}-${slot}`} value={slot}>
              {day.day} - {slot}
            </option>
          ))
        )}
      </select>

      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="online">Online</option>
        <option value="in-person">In-person</option>
      </select>

      <button onClick={handleBooking}>Book Now</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookSessionForm;
