import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsCartFill, BsPersonCircle, BsListCheck } from "react-icons/bs";
import { FaUserMd } from "react-icons/fa";
import { toast } from "react-toastify";
import {  FaQuestionCircle } from "react-icons/fa";

function CustomerNavbar({ cartCount }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimer = useRef(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  const handleQnAClick = () => {
    if (userId) navigate("/askQuestion");
    else toast.info("Login to ask a question", { autoClose: 2000 });
  };

  const handleLogoutClick = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const buttonStyle = {
    backgroundColor: "#fff",
    border: "2px solid black",
    color: "black",
    fontWeight: "600",
    borderRadius: "50px",
    padding: "6px 16px",
  };

  const dropdownStyle = {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid black",
    borderRadius: "8px",
    zIndex: 1000,
    minWidth: "160px",
    padding: "5px 0",
  };

  const dropdownItemStyle = {
    color: "black",
    fontWeight: "500",
    padding: "8px 15px",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left",
    width: "100%",
  };

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimer.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="container-fluid">
        {/* Brand */}
        <NavLink className="navbar-brand fw-bold fs-3" to="/" style={{ color: "#000" }}>
          <span style={{ fontWeight: "300" }}>Brick</span>
          <span style={{ fontWeight: "700", color: "#1ec6b6" }}>Store</span>
        </NavLink>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Right side nav */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">

            {/* Profile Dropdown */}
            <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className="btn" style={buttonStyle}>
                <BsPersonCircle size={18} className="me-1" />
                {userId ? "Profile" : "Sign In"}
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu show mt-2" style={dropdownStyle}>
                  {userId ? (
                    <>
                      <button style={dropdownItemStyle} onClick={() => navigate(`/viewappointments`)}>Appointment</button>
                      <button style={dropdownItemStyle} onClick={() => navigate(`/editprofile/${userId}`)}>Profile</button>
                      <button style={dropdownItemStyle} onClick={handleLogoutClick}>Logout</button>
                    </>
                  ) : (
                    <>
                      <button style={dropdownItemStyle} onClick={handleLoginClick}>Login</button>
                      <button style={dropdownItemStyle} onClick={handleRegisterClick}>Register</button>
                    </>
                  )}
                </div>
              )}
            </li>

            {/* Orders */}
            <li className="nav-item">
              <NavLink to={`/orders/${userId}`}>
                <button className="btn" style={buttonStyle}>
                  <BsListCheck size={18} className="me-1" /> Orders
                </button>
              </NavLink>
            </li>

            {/* QnA */}
            <li className="nav-item">
              <button onClick={handleQnAClick} className="btn" style={buttonStyle}>
                <FaUserMd size={18} className="me-1" icon={<FaQuestionCircle />}/> Help
              </button>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <NavLink to={`/viewcart/${userId}`}>
                <button className="btn position-relative" style={buttonStyle}>
                  <BsCartFill size={18} />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </button>
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default CustomerNavbar;
