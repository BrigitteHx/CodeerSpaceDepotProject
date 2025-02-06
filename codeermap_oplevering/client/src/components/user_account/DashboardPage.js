import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Sun, BatteryCharging, Settings } from "lucide-react";  // Importing icons for Solar, Battery, and Simulation
import "./style/DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  // Function to navigate to the specific dashboards
  const navigateToSolarPanel = () => {
    navigate('/SolarDashboard');
  };

  const navigateToBattery = () => {
    navigate('/BatteryDashboard');
  };

  const navigateToSimulation = () => {
    navigate('/SimulationDashboard');
  };

  return (
    <div className="dashboard-page">
      {/* Top container with welcome message */}
      <div className="dashboard-page-box-1 bg-primary text-white text-center p-5">
        <h1>Welcome to Your Dashboard!</h1>
        <p>
          This is your personal dashboard where you can monitor your solar energy production, battery status, and other vital information.
        </p>
      </div>

      {/* Information about the three dashboards */}
      <div className="dashboard-page-charts-row">
        <div className="dashboard-page-container dashboard-card">
          <div className="dashboard-card-icon">
            <Sun size={60}color="#ffc107" />
          </div>
          <div className="dashboard-card-text">
            <p><strong>Solar Panel Dashboard</strong>: In this dashboard, you can monitor your solar panel's energy production, track its performance over time, and assess the amount of power being generated daily, weekly, and monthly.</p>
            <button onClick={navigateToSolarPanel} className="btn btn-dashboard">Bekijk Solar Panel Dashboard</button>
          </div>
        </div>

        <div className="dashboard-page-container dashboard-card">
          <div className="dashboard-card-icon">
            <BatteryCharging size={60}color="#007bff" />
          </div>
          <div className="dashboard-card-text">
            <p><strong>Battery Dashboard</strong>: The battery dashboard provides a detailed view of your battery's usage and charge level. Track how much power is being consumed, how much charge is left, and gain insights into battery efficiency.</p>
            <button onClick={navigateToBattery} className="btn btn-dashboard">Bekijk Battery Dashboard</button>
          </div>
        </div>

        <div className="dashboard-page-container dashboard-card">
          <div className="dashboard-card-icon">
            <Settings size={60}color="#28a745" />
          </div>
          <div className="dashboard-card-text">
            <p><strong>Simulation Dashboard</strong>: This dashboard allows you to simulate various scenarios and understand how different factors impact your energy production and consumption. Use it to predict future performance or analyze potential improvements.</p>
            <button onClick={navigateToSimulation} className="btn btn-dashboard">Bekijk Simulation Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
