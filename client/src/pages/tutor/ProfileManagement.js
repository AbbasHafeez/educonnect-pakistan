import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "../../style/Profile.css";

const ProfileManagement = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    qualifications: "",
    bio: "",
    subjects: [],
    hourlyRate: "",
    availability: [],
    teachingMode: "online",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/tutor/dashboard");
        const data = res.data.tutor;

        setForm({
          name: data.user.name || "",
          email: data.user.email || "",
          qualifications: data.qualifications || "",
          bio: data.bio || "",
          subjects: data.subjects || [],
          hourlyRate: data.hourlyRate || "",
          availability: data.availability || [],
          teachingMode: data.teachingMode || "online",
          profileImage: null,
        });

        setPreviewImage(data.profileImage || "");
      } catch (err) {
        console.error("❌ Error fetching tutor profile:", err);
        setMessage("Failed to load profile. Are you logged in as a tutor?");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectsChange = (e) => {
    const subjects = e.target.value.split(",").map((s) => s.trim());
    setForm((prev) => ({ ...prev, subjects }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAvailabilityChange = (day, slot) => {
    setForm((prevForm) => {
      const updatedAvailability = [...prevForm.availability];
      const dayEntry = updatedAvailability.find((d) => d.day === day);

      if (dayEntry) {
        if (dayEntry.timeSlots.includes(slot)) {
          dayEntry.timeSlots = dayEntry.timeSlots.filter((s) => s !== slot);
        } else {
          dayEntry.timeSlots.push(slot);
        }
      } else {
        updatedAvailability.push({ day, timeSlots: [slot] });
      }

      return { ...prevForm, availability: updatedAvailability };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "subjects" || key === "availability") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      await api.put("/tutor/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Profile updated successfully.");
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      setMessage("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tutor-page">
      <div className="profile-container form">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h2 className="form-title">Tutor Profile Management</h2>

          <div className="profile-form-grid">
            <div>
              <label>Name:</label>
              <input name="name" value={form.name} onChange={handleChange} required />

              <label>Qualifications:</label>
              <input name="qualifications" value={form.qualifications} onChange={handleChange} required />

              <label>Subjects (comma-separated):</label>
              <input
                name="subjects"
                value={form.subjects.join(",")}
                onChange={handleSubjectsChange}
                required
              />

              <label>Hourly Rate (PKR):</label>
              <input
                type="number"
                name="hourlyRate"
                value={form.hourlyRate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Email:</label>
              <input name="email" value={form.email} disabled />

              <label>Bio:</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                required
              />

              <label>Teaching Mode:</label>
              <select name="teachingMode" value={form.teachingMode} onChange={handleChange}>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="both">Both</option>
              </select>

              <label>Profile Picture:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewImage && (
                <img src={previewImage} alt="Preview" className="profile-preview" />
              )}
            </div>
          </div>

          {/* ✅ Weekly Availability Section */}
          <div className="availability-section">
            <h3>Weekly Availability</h3>
            <table className="availability-table">
              <thead>
                <tr>
                  <th>Day</th>
                  {timeSlots.map((slot) => (
                    <th key={slot}>{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day}>
                    <td>{day}</td>
                    {timeSlots.map((slot) => (
                      <td key={slot}>
                        <input
                          type="checkbox"
                          checked={
                            form.availability.find((d) => d.day === day)?.timeSlots.includes(slot) || false
                          }
                          onChange={() => handleAvailabilityChange(day, slot)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
