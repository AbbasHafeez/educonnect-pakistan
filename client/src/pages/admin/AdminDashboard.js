import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import "../../style/Admin.css";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Reusable ChartCard wrapper
const ChartCard = ({ title, children }) => (
  <div className="chart">
    <h3>{title}</h3>
    {children}
  </div>
);

// ✅ CSV Export helper
const exportCSV = (data, filename = "report.csv") => {
  const csv = data.map(row => Object.values(row).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const AdminDashboard = () => {
  const [reportData, setReportData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reportRes, statsRes] = await Promise.all([
          api.get("/admin/reports", { params: { startDate, endDate } }),
          api.get("/admin/stats"),
        ]);
        setReportData(reportRes.data);
        setAdminStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAll();
  }, [startDate, endDate]);

  if (!reportData || !adminStats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2 style={{ fontWeight: "bold" }}>Reporting Dashboard</h2>

      {/* ✅ Admin Stats */}
      <div className="admin-stats">
        {[
          "totalTutors",
          "pendingVerifications",
          "verifiedTutors",
          "rejectedTutors",
          "totalStudents",
        ].map((key, idx) => (
          <div className="stat-box" key={idx}>
            <h4>{key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</h4>
            <p>{adminStats[key]}</p>
          </div>
        ))}
      </div>

      {/* ✅ Actions */}
      <div className="actions">
        <h3>Actions</h3>
        <Link to="/admin/tutor-verification">
          <button>Go to Tutor Verification</button>
        </Link>
      </div>

      {/* ✅ Date Filter */}
      <div style={{ marginBottom: "20px" }}>
        <label>Filter by Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* ✅ Charts Section */}
      <div className="chart-section">
        {/* Subjects */}
        <ChartCard title="Most Popular Subjects">
          <Bar
            data={{
              labels: reportData.subjectStats.length
                ? reportData.subjectStats.map((s) => s._id)
                : ["No Data"],
              datasets: [
                {
                  label: "Tutors per Subject",
                  data: reportData.subjectStats.length
                    ? reportData.subjectStats.map((s) => s.count)
                    : [0],
                  backgroundColor: "blue",
                },
              ],
            }}
          />
          {reportData.subjectStats.length ? (
            <button onClick={() => exportCSV(reportData.subjectStats, "subjects.csv")}>
              Export CSV
            </button>
          ) : (
            <p style={{ color: "#888" }}>No subject data available.</p>
          )}
        </ChartCard>

        {/* Session Completion */}
        <ChartCard title="Session Completion Rate">
          <Pie
            data={{
              labels: ["Completed", "Remaining"],
              datasets: [
                {
                  data: [
                    reportData.sessionCompletionRate,
                    100 - reportData.sessionCompletionRate,
                  ],
                  backgroundColor: ["green", "red"],
                },
              ],
            }}
          />
        </ChartCard>

        {/* Users by City */}
        <ChartCard title="Users by City">
          <Bar
            data={{
              labels: reportData.userStats.length
                ? reportData.userStats.map((u) => u._id)
                : ["No Data"],
              datasets: [
                {
                  label: "Users",
                  data: reportData.userStats.length
                    ? reportData.userStats.map((u) => u.count)
                    : [0],
                  backgroundColor: "orange",
                },
              ],
            }}
          />
          {reportData.userStats.length ? (
            <button onClick={() => exportCSV(reportData.userStats, "users-by-city.csv")}>
              Export CSV
            </button>
          ) : (
            <p style={{ color: "#888" }}>No city data available.</p>
          )}
        </ChartCard>

        {/* User Growth */}
        <ChartCard title="User Growth Over Time">
          <Line
            data={{
              labels: reportData.userGrowth.length
                ? reportData.userGrowth.map((g) => `Month ${g._id}`)
                : ["No Data"],
              datasets: [
                {
                  label: "Users",
                  data: reportData.userGrowth.length
                    ? reportData.userGrowth.map((g) => g.count)
                    : [0],
                  borderColor: "blue",
                  fill: false,
                },
              ],
            }}
          />
          {reportData.userGrowth.length === 0 && (
            <p style={{ color: "#888" }}>No growth data available.</p>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
