// client/src/pages/student/TutorSearch.js

import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import TutorCard from "./TutorCard"; // same folder or correct path
import "../../style/TutorSearch.css";

const TutorSearch = () => {
  const [filters, setFilters] = useState({
    subject: "",
    teachingMode: "",
    priceMin: "",
    priceMax: "",
    availability: "",
    rating: ""
  });

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.get("/students/search-tutors", { params: filters });
        setResults(res.data);
      } catch (err) {
        console.error("❌ Error fetching tutors:", err);
      }
    };
    fetchTutors();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="search-page">
      <h2>🔍 Find Tutors</h2>
      <div className="filters">
        <input name="subject" placeholder="Subject" onChange={handleChange} />
        <input name="teachingMode" placeholder="Teaching Mode (e.g. online)" onChange={handleChange} />
        <input name="priceMin" placeholder="Min Price" onChange={handleChange} />
        <input name="priceMax" placeholder="Max Price" onChange={handleChange} />
        <input name="availability" placeholder="Day (e.g. Monday)" onChange={handleChange} />
        <input name="rating" type="number" step="0.5" placeholder="Min Rating" onChange={handleChange} />
      </div>

      <div className="results">
        {results.length === 0 ? (
          <p>No tutors found.</p>
        ) : (
          results.map((tutor) => (
            <TutorCard key={tutor._id} tutor={tutor} />
          ))
        )}
      </div>
    </div>
  );
};

export default TutorSearch;
