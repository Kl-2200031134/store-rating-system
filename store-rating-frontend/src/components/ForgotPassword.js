import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleForgot = async (e) => {
  e.preventDefault();

  if (newPassword.length < 8 || newPassword.length > 16) {
    return alert("Password must be 8-16 characters.");
  }
  if (!/[A-Z]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
    return alert("Password must include at least one uppercase and one special character.");
  }

  try {
    await API.put("/auth/forgot-password", { email, newPassword });
    alert("✅ Password reset successful. Please login.");
    navigate("/login");
  } catch (err) {
    alert("❌ " + (err.response?.data?.message || "Error resetting password"));
  }
};

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await API.put("/auth/forgot-password", { email, newPassword });
      alert("✅ Password reset successful, please login");
      navigate("/login");
    } catch (err) {
      alert("❌ Error resetting password: " + (err.response?.data?.message || "Try again"));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3">🔑 Reset Password</h3>
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
