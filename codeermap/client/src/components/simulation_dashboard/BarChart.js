import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data }) => {
  const chartData = {
    labels: ["Total Energy Usage (kWh)", "Solar Energy Generated (kWh)", "Total Savings (€)"],
    datasets: [
      {
        label: "15-Day Performance",
        data: [data.energyUsage, data.panelOutput, data.savings],
        backgroundColor: ["#e74c3c", "#ffc107", "#2ecc71"],
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value"
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto", padding: "10px" }}>
      <h3 style={{ textAlign: "center" }}>Energy Performance Overview</h3>
      <p style={{ textAlign: "center" }}>
        This bar chart displays your total energy consumption, solar energy generated, and financial savings.
      </p>
      <div style={{ height: "400px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
