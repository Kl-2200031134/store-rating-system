import React, { useEffect, useState } from "react";
import API from "../api";

function DashboardOwner() {
  const [data, setData] = useState({ store: "", averageRating: 0, ratings: [] });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/owner/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("❌ Error fetching owner dashboard:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🏪 Owner Dashboard</h2>

      <div className="card p-3 shadow mb-4">
        <p>
          <strong>Store:</strong> {data.store || "No store assigned"}
        </p>
        <p>
          <strong>Average Rating:</strong>{" "}
          {data.averageRating ? data.averageRating.toFixed(2) : "0.00"}
        </p>
      </div>

      <div className="card p-3 shadow">
        <h4>User Ratings</h4>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.ratings.length > 0 ? (
              data.ratings.map((r) => (
                <tr key={r.id}>
                  <td>{r.User?.name}</td>
                  <td>{r.User?.email}</td>
                  <td>{r.rating} ⭐</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No ratings yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardOwner;
