import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">🎉 Welcome to <span className="text-primary">Store Rating System</span></h1>
      <p className="lead mb-5">
        A platform where users can rate stores, owners can see feedback, 
        and admins can manage everything in one place.
      </p>

      {/* Role Benefits */}
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>🛒 Users</h4>
            <p>Find stores, submit ratings, and update your feedback anytime.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>🏪 Owners</h4>
            <p>Track customer ratings and improve your business performance.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>👨‍💻 Admins</h4>
            <p>Manage users, stores, and monitor the entire platform securely.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <Link to="/signup" className="btn btn-primary btn-lg">
        🚀 Get Started
      </Link>
    </div>
  );
}

export default Home;
