import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("USER"); // Default role = User
  const navigate = useNavigate();

  // ✅ Email Regex Validation
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Frontend Validations
    if (name.length < 20 || name.length > 60) {
      return alert("Name must be between 20 and 60 characters.");
    }
    if (!isValidEmail(email)) {
      return alert("Please enter a valid email address.");
    }
    if (address.length === 0 || address.length > 400) {
      return alert("Address is required and must be less than 400 characters.");
    }
    if (password.length < 8 || password.length > 16) {
      return alert("Password must be 8–16 characters.");
    }
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return alert("Password must include at least one uppercase letter and one special character.");
    }

    try {
      await API.post("/auth/signup", { name, email, password, address, role });
      alert("✅ Signup successful, please login");
      navigate("/login", { replace: true });
    } catch (err) {
      alert("❌ Signup failed: " + (err.response?.data?.message || "Try again"));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-3">📝 Signup</h3>
        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="USER">Normal User</option>
              <option value="OWNER">Store Owner</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-success w-100">
            Signup
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
