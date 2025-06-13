import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import {
  FaHome,
  FaEnvelope,
  FaPlusSquare,
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="home-page-container">
      <header className="home-top-nav">
        <div className="home-logo">
          {/* <img src="./sm-logo" alt="Logo" /> */}
          Sphere Mesh
        </div>
        <button
          className="home-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav className={`home-nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/home" end>
            <FaHome /> Home
          </NavLink>
          <NavLink to="messages">
            <FaEnvelope /> Messages
          </NavLink>
          <NavLink to="add-post">
            <FaPlusSquare /> Add Post
          </NavLink>
          <NavLink to="notifications">
            <FaBell /> Notifications
          </NavLink>
          <NavLink to="profile">
            <FaUserCircle /> Profile
          </NavLink>
        </nav>
      </header>

      <div className="layout-content">
        <Outlet />
      </div>

      <footer className="home-bottom-nav">
        <NavLink to="/home" end>
          <FaHome />
        </NavLink>
        <NavLink to="messages">
          <FaEnvelope />
        </NavLink>
        <NavLink to="add-post">
          <FaPlusSquare />
        </NavLink>
        <NavLink to="notifications">
          <FaBell />
        </NavLink>
        <NavLink to="profile">
          <FaUserCircle />
        </NavLink>
      </footer>
    </div>
  );
}

export default Layout;
