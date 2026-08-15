import React, { useEffect, useState } from "react";
import Login from "./Login";
import "./App.css";

import Dashboard from "./components/Dashboard";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintTable from "./components/ComplaintTable";
import Charts from "./components/Charts";
import AIAssistant from "./components/AIAssistant";

const API_URL = "https://ai-complaint-system-2-s713.onrender.com";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);


  // ---------------- COMPLAINT DATA ----------------

  const [complaints, setComplaints] = useState([]);

  // ---------------- FORM DATA ----------------

  const [formData, setFormData] = useState({
    customer_name: "",
    product_name: "",
    batch_number: "",
    complaint: "",
  });

  // ---------------- SEARCH & FILTER ----------------

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ---------------- FETCH COMPLAINTS ----------------

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${API_URL}/complaints`);

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      alert("Could not connect to FastAPI backend.");
    }
  };

  // Fetch PostgreSQL data when app starts
  useEffect(() => {
  if (loggedIn) {
    fetchComplaints();
  }
}, [loggedIn]);
  if (!loggedIn) {
  return <Login onLogin={() => setLoggedIn(true)} />;
}

  // ---------------- FORM CHANGE ----------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- SAVE COMPLAINT ----------------

  const saveComplaint = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/complaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save complaint");
      }

      alert("Complaint Saved Successfully!");

      // Clear form
      setFormData({
        customer_name: "",
        product_name: "",
        batch_number: "",
        complaint: "",
      });

      // Get latest data from PostgreSQL
      fetchComplaints();
    } catch (error) {
      console.error("Error saving complaint:", error);
      alert("Failed to save complaint. Check FastAPI/PostgreSQL.");
    }
  };

  // ---------------- UPDATE STATUS ----------------

  const updateStatus = async (complaintId) => {
    try {
      const response = await fetch(
        `${API_URL}/update-status/${complaintId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      alert("Status Updated Successfully!");

      // Refresh data
      fetchComplaints();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update complaint status.");
    }
  };

  // ---------------- DELETE COMPLAINT ----------------

  const deleteComplaint = async (complaintId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/delete-complaint/${complaintId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete complaint");
      }

      alert("Complaint Deleted Successfully!");

      // Refresh data
      fetchComplaints();
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("Failed to delete complaint.");
    }
  };

  // ---------------- EXPORT EXCEL ----------------

  const exportToExcel = () => {
    alert("Excel export functionality can be connected here.");
  };

  // ---------------- DOWNLOAD PDF ----------------

  const downloadPDF = () => {
    alert("PDF download functionality can be connected here.");
  };

  // ---------------- DASHBOARD COUNTS ----------------

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolvedComplaints = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const batteryCount = complaints.filter(
    (item) => item.category === "Battery Issue"
  ).length;

  const displayCount = complaints.filter(
    (item) => item.category === "Display Issue"
  ).length;

  const audioCount = complaints.filter(
    (item) => item.category === "Audio Issue"
  ).length;

  const chargingCount = complaints.filter(
    (item) => item.category === "Charging Issue"
  ).length;

  const cameraCount = complaints.filter(
    (item) => item.category === "Camera Issue"
  ).length;

  // ---------------- UI ----------------

  return (
    <div className="App">

      <header
        style={{
          background: "#1976d2",
          color: "white",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <h1>AI Complaint Management System</h1>
      </header>

      <div
        style={{
          width: "90%",
          margin: "20px auto",
        }}
      >

        {/* DASHBOARD */}

        <Dashboard
          totalComplaints={totalComplaints}
          pendingComplaints={pendingComplaints}
          resolvedComplaints={resolvedComplaints}
          batteryCount={batteryCount}
          displayCount={displayCount}
          audioCount={audioCount}
          chargingCount={chargingCount}
          cameraCount={cameraCount}
        />

        <hr />

        {/* COMPLAINT FORM */}

        <ComplaintForm
          formData={formData}
          handleChange={handleChange}
          saveComplaint={saveComplaint}
          exportToExcel={exportToExcel}
          downloadPDF={downloadPDF}
        />

        <hr />

        {/* COMPLAINT TABLE */}

        <ComplaintTable
          complaints={complaints}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          updateStatus={updateStatus}
          deleteComplaint={deleteComplaint}
        />

        <hr />

        {/* CHARTS */}

        <Charts
          batteryCount={batteryCount}
          displayCount={displayCount}
          audioCount={audioCount}
          chargingCount={chargingCount}
          cameraCount={cameraCount}
        />

        <hr />

        {/* AI ASSISTANT */}

       <AIAssistant onComplaintSaved={fetchComplaints} />

      </div>
    </div>
  );
}

export default App;