import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/Aboutus";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardUser from "./components/DashboardUser";
import DashboardOwner from "./components/DashboardOwner";
import ChangePassword from "./components/changePassword";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Aboutus" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signUp" element={<Signup />} />
        
        {/* Dashboards */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/user" element={<DashboardUser />} />
        <Route path="/owner" element={<DashboardOwner />} />
<Route path="/change-password" element={<ChangePassword />}/>

        {/* Fallback route for unknown paths */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
