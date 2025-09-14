import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import useLogout from "../hooks/useLogout";
import "../components/Navbar.css"; 

function AppNavbar() {
  const role = localStorage.getItem("role");
  const logout = useLogout();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Store Rating System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/aboutus">About Us</Nav.Link>

            {/* Show Login/Signup only if not logged in */}
            {!role && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {!role && <Nav.Link as={Link} to="/signup">Signup</Nav.Link>}

            {/* Dashboards based on role */}
            {role === "USER" && <Nav.Link as={Link} to="/user">User Dashboard</Nav.Link>}
            {role === "ADMIN" && <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>}
            {role === "OWNER" && <Nav.Link as={Link} to="/owner">Owner Dashboard</Nav.Link>}

            {/* Change Password only for USER & OWNER */}
            {(role === "USER" || role === "OWNER") && (
              <Nav.Link as={Link} to="/change-password">Change Password</Nav.Link>
            )}
          </Nav>

          {/* Logout button (shown for all logged-in roles) */}
          {role && (
            <button className="btn btn-outline-danger ms-auto" onClick={logout}>
              Logout
            </button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
