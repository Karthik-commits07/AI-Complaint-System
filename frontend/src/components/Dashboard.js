import React from "react";

function Dashboard({
  totalComplaints,
  pendingComplaints,
  resolvedComplaints,
  batteryCount,
  displayCount,
  audioCount,
  chargingCount,
  cameraCount,
}) {
  return (
    <>
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body text-center">
              <h5>Total Complaints</h5>
              <h2>{totalComplaints}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body text-center">
              <h5>Pending</h5>
              <h2>{pendingComplaints}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body text-center">
              <h5>Resolved</h5>
              <h2>{resolvedComplaints}</h2>
            </div>
          </div>
        </div>

      </div>

      <div className="row g-3">

        <div className="col-md-2">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <h6>🔋 Battery</h6>
              <h3>{batteryCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card border-danger shadow-sm">
            <div className="card-body text-center">
              <h6>📱 Display</h6>
              <h3>{displayCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card border-info shadow-sm">
            <div className="card-body text-center">
              <h6>🔊 Audio</h6>
              <h3>{audioCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-warning shadow-sm">
            <div className="card-body text-center">
              <h6>🔌 Charging</h6>
              <h3>{chargingCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <h6>📷 Camera</h6>
              <h3>{cameraCount}</h3>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;