
import React from "react";

function Reports() {
  const reports = [
    { title: "Total Complaints", value: 1, color: "#16a34a" },
    { title: "Pending Complaints", value: 1, color: "#eab308" },
    { title: "Resolved Complaints", value: 0, color: "#0ea5e9" },
    { title: "Assigned Complaints", value: 0, color: "#8b5cf6" }
  ];

  return (
    <div style={{ padding: "30px", color: "#1f2937" }}>
      <h1>Waste Management Reports</h1>
      <p>Summary of waste complaints and collection activities.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>
        {reports.map((item, index) => (
          <div key={index} style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 2px 10px #ddd",
            borderTop: `4px solid ${item.color}`
          }}>
            <h3>{item.title}</h3>
            <h1 style={{ color: item.color }}>{item.value}</h1>
          </div>
        ))}
      </div>

      <div style={{
        background: "white",
        padding: "25px",
        marginTop: "30px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px #ddd"
      }}>
        <h2>Complaint Summary</h2>
        <p>Total complaints registered: 1</p>
        <p>Pending complaints: 1</p>
        <p>Resolved complaints: 0</p>
        <p>Assigned complaints: 0</p>
      </div>

      <div style={{
        background: "white",
        padding: "25px",
        marginTop: "20px",
        borderRadius: "12px"
      }}>
        <h2>Waste Collection Statistics</h2>
        <p>Collection statistics will be updated when collection data is available.</p>
      </div>
    </div>
  );
}

export default Reports;
