// client/src/components/tutors/EarningsChart.js
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const EarningsChart = () => {
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get("/sessions/earnings");

        const weeklyData = Object.entries(res.data.weekly).map(([week, total]) => ({
          label: week,
          earnings: total,
        }));

        const monthlyData = Object.entries(res.data.monthly).map(([month, total]) => ({
          label: month,
          earnings: total,
        }));

        setWeekly(weeklyData);
        setMonthly(monthlyData);
      } catch (err) {
        console.error("❌ Error fetching earnings summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <p>Loading earnings summary...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Weekly Earnings</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={weekly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="earnings" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "40px" }}>📅 Monthly Earnings</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="earnings" fill="#28a745" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
