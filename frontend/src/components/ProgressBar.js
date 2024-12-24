import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ goal, actual }) => {
  // Calculate the progress percentage
  const progress = goal > 0 ? Math.min((actual / goal) * 100, 100) : 0;

  // Styles for the progress bar container
  const containerStyle = {
    display: "flex", // Align bar and text side-by-side
    alignItems: "center", // Center the text vertically
    width: "100%",
    marginBottom: "10px", // Space below the bar-text combo
  };

  const barContainerStyle = {
    flexGrow: 1, // Bar takes as much space as available
    backgroundColor: "#e0e0e0", // Light gray background
    borderRadius: "10px", // Rounded corners
    overflow: "hidden", // Ensures rounded corners are preserved
    height: "20px", // Height of the progress bar
    marginRight: "10px", // Space between bar and text
  };

const progressBarStyle = {
  width: `${progress}%`, // Set the width dynamically
  height: "100%", // Full height of the container
  backgroundColor: "#3f51b5", // Blue color for the progress
  borderRadius: "10px", // Rounded edges
  transition: "width 0.3s ease-in-out", // Smooth transition for animation
};

  const textStyle = {
    fontSize: "14px",
    color: "#555", // Dark gray text
    whiteSpace: "nowrap", // Prevent text from wrapping
  };

  return (
    <div style={containerStyle}>
      {/* Progress Bar */}
      <div style={barContainerStyle}>
        <div style={progressBarStyle}></div>
      </div>
      {/* Text */}
      <div style={textStyle}>
        {`${Math.round(progress)}% (${actual}/${goal})`}
      </div>
    </div>
  );
};

// Prop types validation
ProgressBar.propTypes = {
  goal: PropTypes.number.isRequired,
  actual: PropTypes.number.isRequired,
};

export default ProgressBar;
