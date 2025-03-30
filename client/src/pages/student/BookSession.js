// client/src/pages/student/BookSession.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import BookSessionForm from "./BookSessionForm";

const BookSession = () => {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🟦 BookSession: Received tutorId param:", tutorId); // Log ID
    const fetchTutor = async () => {
      try {
        const res = await api.get(`/tutor/${tutorId}`); 
        console.log("🟩 /tutor/:id response data:", res.data);
        setTutor(res.data.tutor);
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setError("Could not load tutor data.");
      }
    };
    fetchTutor();
  }, [tutorId]);

  if (error) return <p>{error}</p>;
  if (!tutor) return <p>Loading tutor...</p>;

  return (
    <div className="book-session">
      <h2>Book a Session with {tutor.user?.name}</h2>
      <BookSessionForm tutor={tutor} />
    </div>
  );
};

export default BookSession;
