import React from "react";

function About() {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">ℹ️ About <span className="text-primary">Store Rating System</span></h1>

      {/* Purpose */}
      <div className="mb-4">
        <p className="lead">
          The <strong>Store Rating System</strong> is designed to make customer
          feedback transparent, helping users make better choices, store owners
          track performance, and admins maintain control over the platform.
        </p>
      </div>

      {/* Key Features */}
      <div className="card p-4 shadow-sm mb-4">
        <h3>🚀 Key Features</h3>
        <ul className="list-unstyled mt-2">
          <li>🔐 Role-based authentication (User, Owner, Admin)</li>
          <li>⭐ Submit, view, and update ratings for stores</li>
          <li>📊 Dashboards tailored for each role</li>
          <li>🔍 Search & filter functionality for quick access</li>
          <li>⚡ Real-time average rating calculations</li>
        </ul>
      </div>

      {/* Who Benefits */}
      <div className="card p-4 shadow-sm mb-4">
        <h3>👥 Who Benefits</h3>
        <ul className="list-unstyled mt-2">
          <li>🛒 <strong>Users:</strong> Easily find and rate stores</li>
          <li>🏪 <strong>Owners:</strong> View customer feedback to improve services</li>
          <li>👨‍💻 <strong>Admins:</strong> Manage users, stores, and overall system health</li>
        </ul>
      </div>

      {/* Future Enhancements */}
      <div className="card p-4 shadow-sm">
        <h3>📌 Future Enhancements</h3>
        <ul className="list-unstyled mt-2">
          <li>📈 Advanced analytics dashboard for admins</li>
          <li>💬 User review comments alongside ratings</li>
          <li>🏷️ Store categories and search filters (e.g., food, pharmacy, retail)</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
