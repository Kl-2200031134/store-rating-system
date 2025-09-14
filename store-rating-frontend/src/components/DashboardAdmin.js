import React, { useEffect, useState } from "react";
import API from "../api";

function DashboardAdmin() {
  const [dashboard, setDashboard] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sort, setSort] = useState({ field: "id", order: "ASC" });

  // 🔹 For password reset modal
   const [success, setSuccess] = useState(""); 
  const [error, setError] = useState("");  // <-- this fixes your ESLint errors
  const [resetUserId, setResetUserId] = useState(null);
  const [resetUserEmail, setResetUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  }, []);

  // Dashboard counts
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setDashboard(res.data);
    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);
    }
  };

  // Users with filters + sorting
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        params: { ...filters, sortField: sort.field, sortOrder: sort.order },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  };

  // Stores with owners + ratings
  const fetchStores = async () => {
    try {
      const res = await API.get("/admin/stores");
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("❌ Error fetching stores:", err);
    }
  };

 //const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

// Reset Password (called when modal submit clicked)
const handleResetPassword = async () => {
  if (!newPassword) {
    setError("⚠️ Please enter a new password.");
    setSuccess("");
    return;
  }
  if (newPassword.length < 8 || newPassword.length > 16) {
    setError("⚠️ Password must be 8–16 characters long.");
    setSuccess("");
    return;
  }
  if (!/[A-Z]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
    setError("⚠️ Must include at least one uppercase & one special character.");
    setSuccess("");
    return;
  }

  try {
    await API.put(`/admin/users/${resetUserId}/reset-password`, { newPassword });
    setSuccess(`✅ Password updated successfully for ${resetUserEmail}`);
    setError("");
    setNewPassword("");

    // Auto close modal after 2s
    setTimeout(() => {
      setResetUserId(null);
      setSuccess("");
    }, 2000);
  } catch (err) {
    setError("❌ Error resetting password. Please try again.");
    setSuccess("");
  }
};


  // Toggle sorting
  const toggleSort = (field) => {
    setSort({
      field,
      order: sort.field === field && sort.order === "ASC" ? "DESC" : "ASC",
    });
    fetchUsers();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📊 Admin Dashboard</h2>

      {/* Summary cards */}
      <div className="row text-center mb-4">
        <div className="col-md-4">
          <div className="card shadow p-3"><h4>Total Users</h4><p>{dashboard.totalUsers}</p></div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3"><h4>Total Stores</h4><p>{dashboard.totalStores}</p></div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3"><h4>Total Ratings</h4><p>{dashboard.totalRatings}</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3 mb-4 shadow">
        <h4>Search Users</h4>
        <div className="row">
          <div className="col"><input className="form-control" placeholder="Name" onChange={(e) => setFilters({ ...filters, name: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Email" onChange={(e) => setFilters({ ...filters, email: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Address" onChange={(e) => setFilters({ ...filters, address: e.target.value })} /></div>
          <div className="col">
            <select className="form-control" onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="col"><button className="btn btn-info w-100" onClick={fetchUsers}>Apply</button></div>
        </div>
      </div>

      {/* Users */}
      <div className="card p-3 mb-4 shadow">
        <h4>Users</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Name ⬍</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Owner Avg Rating</th>
              <th>Reset Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
                <td>{u.role === "OWNER" ? (u.ownerAvgRating || "No Ratings") : "-"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setResetUserId(u.id);
                      setResetUserEmail(u.email);
                    }}
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stores */}
      <div className="card p-3 mb-4 shadow">
        <h4>Stores</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Store</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Owner Email</th>
              <th>Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.ownerName}</td>
                <td>{s.ownerEmail}</td>
                <td>{s.averageRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* Reset Password Modal */}
{resetUserId && (
  <div className="modal show" style={{ display: "block" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Reset Password for {resetUserEmail}</h5>
          <button className="btn-close" onClick={() => setResetUserId(null)}></button>
        </div>
        <div className="modal-body">
          <input
            type="password"
            className="form-control"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {error && <small className="text-danger">{error}</small>}
          {success && <small className="text-success">{success}</small>}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setResetUserId(null)}>Cancel</button>
          <button className="btn btn-warning" onClick={handleResetPassword}>Reset</button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default DashboardAdmin;
