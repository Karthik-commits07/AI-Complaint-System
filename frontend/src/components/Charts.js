import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Charts({
  batteryCount,
  displayCount,
  audioCount,
  chargingCount,
  cameraCount,
}) {
  const pieData = [
    { name: "Battery", value: batteryCount },
    { name: "Display", value: displayCount },
    { name: "Audio", value: audioCount },
    { name: "Charging", value: chargingCount },
    { name: "Camera", value: cameraCount },
  ];

  const COLORS = [
    "#0d6efd",
    "#dc3545",
    "#20c997",
    "#ffc107",
    "#198754",
  ];

  return (
    <div className="row mt-4">

      <div className="col-lg-6 mb-4">
        <div className="card shadow p-3">
          <h4 className="text-center mb-3">
            Complaint Category Distribution
          </h4>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={120}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-lg-6 mb-4">
        <div className="card shadow p-3">
          <h4 className="text-center mb-3">
            Complaint Analysis
          </h4>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="value" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default Charts;