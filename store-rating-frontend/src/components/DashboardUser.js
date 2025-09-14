import React, { useEffect, useState } from "react";
import API from "../api";

function DashboardUser() {
  const [stores, setStores] = useState([]);
  const [newRatings, setNewRatings] = useState({});
  const [filters, setFilters] = useState({ name: "", address: "" });

  useEffect(() => {
    fetchStores();
  }, []);

  // Fetch stores with filters
  const fetchStores = async () => {
    try {
      const res = await API.get("/stores", { params: filters });
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("❌ Error fetching stores:", err);
    }
  };

  // Submit or update rating
  const handleRate = async (storeId) => {
    const rating = newRatings[storeId];
    if (!rating) return alert("Please select a rating");

    try {
      await API.post(`/stores/${storeId}/rate`, { rating });
      alert("✅ Rating submitted/updated!");
      fetchStores();
    } catch (err) {
      alert("❌ Error submitting rating");
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛒 User Dashboard</h2>

      {/* Search Section */}
      <div className="card p-3 mb-4 shadow">
        <h4>🔍 Search Stores</h4>
        <div className="row">
          <div className="col">
            <input
              className="form-control"
              placeholder="Search by Name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Search by Address"
              onChange={(e) =>
                setFilters({ ...filters, address: e.target.value })
              }
            />
          </div>
          <div className="col">
            <button className="btn btn-info w-100" onClick={fetchStores}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Store List */}
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Store</th>
            <th>Address</th>
            <th>Average Rating</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.averageRating}</td>
              <td>{s.userRating || "Not rated yet"}</td>
              <td>
                <div className="d-flex">
                  <select
                    className="form-control me-2"
                    value={newRatings[s.id] || ""}
                    onChange={(e) =>
                      setNewRatings({ ...newRatings, [s.id]: e.target.value })
                    }
                  >
                    <option value="">Rate</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleRate(s.id)}
                  >
                    {s.userRating ? "Update" : "Submit"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardUser;
