import React from "react";
import "./TestPage.css"; // Ensure this imports your CSS file

function TestPage() {
  return (
    <div className="dashboard-container">
      {/* First Column */}
      <div className="first-column">
        {/* Header */}
        <div className="header">
          <div>SPRING 2025</div>
          <div>Last updated: 3:47 PM</div>
        </div>

        {/* Chart */}
        <div className="chart-card">
          <h3>RESEARCH HOURS OVER TIME</h3>
          <div style={{ height: "250px", background: "#ddd", borderRadius: "10px" }}>
            <p style={{ textAlign: "center", lineHeight: "250px", color: "#999" }}>
              Chart Placeholder
            </p>
          </div>
        </div>

        {/* Overview Card */}
        <div className="overview-card">
          <div className="overview-item">
            <h1>876</h1>
            <p>Timeslot</p>
          </div>
          <div className="overview-item">
            <h1>93%</h1>
            <p>Progress</p>
          </div>
        </div>
      </div>

      {/* Second Column */}
      <div className="second-column">
        {/* Progress Cards */}
        <div className="progress-card">
          <h3>MOR SONA AGGREGATION</h3>
          <span>Actual: 1882</span>
          <span>Goal: 2100</span>
        </div>
        <div className="progress-card">
          <h3>MKT SONA AGGREGATION</h3>
          <span>Actual: 1450</span>
          <span>Goal: 2000</span>
        </div>
        <div className="progress-card">
          <h3>COMP SONA AGGREGATION</h3>
          <span>Actual: 1750</span>
          <span>Goal: 2200</span>
        </div>

        {/* Study List */}
        <div className="study-list">
          <h3>STUDY LIST</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#333" }}>
            <li>Study 1: Exploring Behavioral Trends</li>
            <li>Study 2: Consumer Preferences Analysis</li>
            <li>Study 3: Decision-Making Patterns</li>
            <li>Study 4: Market Research Insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TestPage;