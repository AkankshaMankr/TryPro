import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!sessionStorage.getItem("userName")) {
      navigate("/");
    } else if (sessionStorage.getItem("userRole") === "CUSTOMER") {
      navigate("/customer");
    } else if (sessionStorage.getItem("userRole") === "ADMIN") {
      navigate("/admin");
    }
  }, [navigate]);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");

  const editUrl = `http://localhost:5050/customer/getUserById/${id}`;
  const updateUrl = `http://localhost:5050/customer/updateUser/${id}`;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
      },
    };

    axios
      .get(editUrl, config)
      .then((response) => {
        const { userName, email, contact, pincode, address } = response.data;
        setUserName(userName || "");
        setEmail(email || "");
        setContact(contact || "");
        setPincode(pincode || "");
        setAddress(address || "");
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details");
      });
  }, [editUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
      },
    };

    const userDetails = {
      userName,
      email,
      contact,
      pincode,
      address,
    };

    axios
      .put(updateUrl, userDetails, config)
      .then(() => {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile.");
      });
  };

  return (
    <>
      <style>{`
        .edit-profile-container {
          min-height: 100vh;
          background-color: #0a192f;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 0;
        }

        .edit-profile-card {
          width: 35rem;
          border: 2px solid #1ec6b6;
          background-color: #112240;
          border-radius: 12px;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
          padding: 2rem;
        }

        .edit-profile-card h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #1ec6b6;
        }

        .edit-profile-card label {
          font-weight: 500;
          color: #ffffff;
        }

        .edit-profile-card input,
.edit-profile-card textarea {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #1ec6b6;
  width: 100%;
}

        .edit-profile-card input:focus,
        .edit-profile-card textarea:focus {
          border-color: #1ec6b6;
          box-shadow: 0 0 5px #1ec6b6;
          outline: none;
        }

        .edit-profile-btn {
          background-color: #1ec6b6;
          color: #ffffff;
          font-weight: bold;
          border: none;
          transition: background-color 0.3s ease;
          width: 100%;
        }

        .edit-profile-btn:hover {
          background-color: #17b0a2;
        }
      `}</style>

      <div className="edit-profile-container">
        <ToastContainer />
        <div className="edit-profile-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>User Name:</label>
              <input
                type="text"
                className="form-control"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Contact:</label>
              <input
                type="text"
                className="form-control"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={10}
                pattern="\\d{10}"
                required
              />
            </div>

            <div className="mb-3">
              <label>Pincode:</label>
              <input
                type="text"
                className="form-control"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                pattern="\\d{6}"
                required
              />
            </div>

            <div className="mb-3">
              <label>Address:</label>
              <textarea
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <button type="submit" className="edit-profile-btn btn" >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
