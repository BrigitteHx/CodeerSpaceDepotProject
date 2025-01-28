import React from "react";

const NoData = ({ navigate }) => (
    <div className="no-data-container simulation-dashboard">
      <h2>No Simulation Data Available</h2>
      <p>It seems like you haven’t completed your simulation yet. Please fill out the simulation form to generate your dashboard.</p>
      <button onClick={() => navigate("/simulationForm")} className="btn btn-primary">Go to Simulation Form</button>
    </div>
);

export default NoData; 