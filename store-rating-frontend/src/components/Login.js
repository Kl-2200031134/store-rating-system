import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      // ✅ Save token & role before navigation
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // ✅ Navigate only after token is stored
      if (res.data.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (res.data.role === "OWNER") {
        navigate("/owner", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    } catch (err) {
      alert("❌ Login failed. Check your email and password.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3">🔑 Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        
        <p className="text-center mt-3">
  Don’t have an account? <a href="/signup">Signup</a><br />
  <a href="/forgot-password" className="text-danger">Forgot Password?</a>
</p>

      </div>
    </div>
  );
}

export default Login;
