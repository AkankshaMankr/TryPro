import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerNavbar from "../Components/CustomerNavbar";
import "./BookAppointment.css"

function BookAppointment() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!sessionStorage.getItem("userName")) {
      navigate("/");
    } else if (sessionStorage.getItem("userRole") === "CUSTOMER") {
      navigate("/customer");
    } else if (sessionStorage.getItem("userRole") === "ADMIN") {
      navigate("/admin");
    }
    else if (sessionStorage.getItem("userRole") === "ENGINEER") {
    navigate("/engineer");
    }
  }, [navigate]);

  const [engineers, setEngineers] = useState([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [sqft, setSqft] = useState("");
  const [bhk, setBhk] = useState("");
  const [floor, setFloor] = useState("");
  const [landDescription, setLandDescription] = useState("");

 useEffect(() => {
  // Fetch engineers on load
  const fetchEngineers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get("http://localhost:5050/admin/getAllEngineers", config);
      setEngineers(response.data);
    } catch (error) {
      console.error("Error fetching engineers:", error);
      toast.error("Failed to load engineers!", { autoClose: 2000 });
    }
  };

  fetchEngineers();
}, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedEngineerId || !appointmentDate || !sqft || !bhk || !floor || !landDescription) {
      toast.warn("Please fill all the fields!", { autoClose: 2000 });
      return;
    }

    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Appointment date must be today or in the future!", { autoClose: 2000 });
      return;
    }
    if (parseInt(bhk) <= 0 || !Number.isInteger(Number(bhk))) {
      toast.error("BHK must be atleast 1", { autoClose: 2000 });
      return;
    }
    
    if (parseInt(floor) <= 0 || !Number.isInteger(Number(floor))) {
      toast.error("Floor no hould be valid", { autoClose: 2000 });
      return;
    }
    
    if (parseFloat(sqft) <= 0 || !Number.isInteger(Number(sqft))) {
      toast.error("Square Foot must be valid", { autoClose: 2000 });
      return;
    }
    

    const appointmentData = {
      userId: parseInt(userId),
      engineerId: parseInt(selectedEngineerId),
      appointmentDate,
      sqft: parseFloat(sqft),
      bhk: parseInt(bhk),
      floor: parseInt(floor),
      landDescription,
    };

   try {
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
      "Content-Type": "application/json",
    },
  };

  await axios.post("http://localhost:5050/customer/bookAppointment", appointmentData, config);
  toast.success("Appointment booked successfully!", { autoClose: 2000 });
  setTimeout(() => navigate("/viewAppointments"), 2500);
} catch (error) {
  console.error("API Error:", error);
  toast.error("Failed to book appointment. Please try again!", { autoClose: 3000 });
}

  };

  return (
      <div style={{marginTop:"4%",width:"50%",marginLeft:"25%"}}>
      <ToastContainer />
        <div className="row justify-content-center ">
          <div className="col-md-8">
            <div className="card p-4 shadow-lg">
              <h2 className="text-center mb-4 fw-bold ">Book Appointment</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Engineer:</label>
                  <select
                    className="form-select"
                    value={selectedEngineerId}
                    onChange={(e) => setSelectedEngineerId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Engineer --</option>
                    {engineers.map((eng) => (
                      <option key={eng.id} value={eng.id}>
                        {eng.userName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold">Appointment Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold">Square Foot:</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold">BHK:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold">Floor:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Land Description:</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={landDescription}
                    onChange={(e) => setLandDescription(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn w-100 py-2">
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
       </div>
  );
}

export default BookAppointment;
