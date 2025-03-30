import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>EduConnect Pakistan</h1>
        <p>Connecting students with the best tutors – Anytime, Anywhere.</p>
        <div className="cta-buttons">
          <button onClick={() => navigate("/register")} className="btn primary-btn">
            Join as a Tutor
          </button>
          <button onClick={() => navigate("/register")} className="btn secondary-btn">
            Find a Tutor
          </button>
        </div>
      </section>

      {/* Role Selection */}
      <section className="role-selection">
        <h2>Select Your Role</h2>
        <div className="role-buttons">
          <button onClick={() => navigate("/student/auth")} className="role-btn">
            Student
          </button>
          <button onClick={() => navigate("/tutor/auth")} className="role-btn">
            Tutor
          </button>
          <button onClick={() => navigate("/admin/login")} className="role-btn">
            Admin
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About EduConnect Pakistan</h2>
        <p>
          EduConnect Pakistan is a platform that connects students with verified professional tutors to ensure high-quality education.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>📩 Contact us: support@educonnect.pk | 📜 Terms & Privacy</p>
      </footer>
    </div>
  );
};

export default Home;
