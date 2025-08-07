import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";

function About() {
  return (
    <div
    style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      padding: "40px 20px",
      color: "#f1f5f9",
      fontFamily: "Segoe UI, sans-serif",
    }}
  >
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#1e293b",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h1 style={{ color: "#14b8a6", fontWeight: "bold", marginBottom: "20px" }}>
        About Us
      </h1>

      <p style={{ lineHeight: "1.7", fontSize: "1.1rem", marginBottom: "16px" }}>
        Welcome to <strong style={{ color: "#14b8a6" }}>BrickStore</strong>,
        your trusted partner for construction expertise. Our platform connects
        skilled engineers with customers looking to build or renovate their dream
        spaces.
      </p>

      <p style={{ lineHeight: "1.7", fontSize: "1.1rem", marginBottom: "16px" }}>
        With our streamlined appointment booking, transparent communication,
        and document management, BrickStore brings clarity and confidence to
        every construction project.
      </p>

      <p style={{ lineHeight: "1.7", fontSize: "1.1rem" }}>
        Whether you're an engineer seeking opportunities or a customer with a
        vision we're here to help you build it right.
      </p>
    </div>
  </div>
);
}
export default About;
