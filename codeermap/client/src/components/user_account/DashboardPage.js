import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from 'html2canvas';  // Importing html2canvas for image capture
import jsPDF from 'jspdf';  // Importing jsPDF for PDF export
import "./style/DashboardPage.css";

// Registering the necessary components for charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState("week"); // Track selected time period

  // Data for different periods (simplified for demonstration)
  const data = {
    day: {
      labels: ["12 AM", "6 AM", "12 PM", "6 PM"],
      panelOutput: [50, 70, 80, 90],
      batteryUsage: [20, 30, 40, 45],
      batteryLevel: [100, 95, 90, 85],
    },
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      panelOutput: [50, 60, 80, 90, 110, 100, 120],
      batteryUsage: [20, 30, 40, 35, 50, 60, 55],
      batteryLevel: [100, 95, 90, 85, 80, 75, 70],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      panelOutput: [150, 200, 220, 250],
      batteryUsage: [80, 90, 100, 110],
      batteryLevel: [95, 90, 85, 80],
    },
    year: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      panelOutput: [400, 500, 600, 700, 800, 900, 1000],
      batteryUsage: [100, 150, 200, 250, 300, 350, 400],
      batteryLevel: [95, 90, 85, 80, 75, 70, 65],
    },
  };

  // Set the chart data based on the selected time period
  const chartData = {
    labels: data[timePeriod].labels,
    datasets: [
      {
        label: "Panel Output",
        data: data[timePeriod].panelOutput,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
      },
      {
        label: "Battery Usage",
        data: data[timePeriod].batteryUsage,
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
      },
      {
        label: "Battery Level",
        data: data[timePeriod].batteryLevel,
        borderColor: "#ffc107",
        backgroundColor: "rgba(255, 193, 7, 0.1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Function to handle exporting chart as image
  const exportChartAsImage = () => {
    const chartElement = document.querySelector('.chart-container canvas');
    html2canvas(chartElement).then((canvas) => {
      const imageURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'chart-image.png';
      link.click();
    });
  };

  // Function to handle exporting chart as PDF
  const exportChartAsPDF = () => {
    const chartElement = document.querySelector('.chart-container');
    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 160);
      pdf.save('chart.pdf');
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/login');
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

      {/* Main chart container */}
      <div className="dashboard-page-container charts-container my-4">
        <div className="dashboard-page-charts-row">
          <div className="col-md-12 dashboard-chart-box ">
            <h2 className="chart-title">Energy Production and Battery Status</h2>
            <div className="time-period-selector mt-4">
              <label htmlFor="timePeriod" className="mr-2">Select Time Period:</label>
              <select
                id="timePeriod"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="form-control w-auto d-inline-block"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>

             {/* Export Buttons */}
             <div className="export-options mt-4">
              <button className="btn btn-primary" onClick={exportChartAsImage}>Export as Image</button>
              <button className="btn btn-success ml-3" onClick={exportChartAsPDF}>Export as PDF</button>
            </div>

            <h4>Panel Output, Battery Usage, and Battery Level</h4>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
