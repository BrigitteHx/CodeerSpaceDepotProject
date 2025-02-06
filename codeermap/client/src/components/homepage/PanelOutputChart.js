import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { SimulationData } from "../simulation_dashboard/SimulationData";

const PanelOutputChart = ({ userId, dynamicPrices, hourlyUsage }) => {
  const [solarOutput, setSolarOutput] = useState([]);
  const [isPlaceholderData, setIsPlaceholderData] = useState(false);
  const { results, sunshineData, loading, error } = SimulationData(userId); // Fetching simulation and sunshine data

  // Function to calculate solar output based on form data
  const calculateSolarOutput = (formData, sunshineData) => {
    const { panels, panel_power, panel_efficiency } = formData;
    const sunshineHoursInHours = sunshineData.slice(0, 15).map(duration => duration / 3600); // Assuming sunshineData is in seconds.

    const panelEfficiencyFactor = panel_efficiency / 100;
    const panelPowerKw = panel_power / 1000;

    // Calculate daily output for each hour
    return sunshineHoursInHours.map((hours, index) => {
      const isPeakHour = index >= 10 && index <= 14; // Define peak hours
      const peakMultiplier = isPeakHour ? 1.5 : 1;
      return parseFloat((panels * panelPowerKw * hours * panelEfficiencyFactor * peakMultiplier).toFixed(2));  
    });
  };

  // Placeholder Data (Nep Data)
  const placeholderOutput = Array.from({ length: 15 }, () => (Math.random() * 3 + 1).toFixed(2));

  // Date Labels
  const today = new Date();
  const dateLabels = Array.from({ length: 15 }, (_, i) => {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    return nextDay.toLocaleDateString('en-GB');
  });   

  useEffect(() => {
    if (results && sunshineData) {
      const output = calculateSolarOutput(results, sunshineData);
      setSolarOutput(output);
      setIsPlaceholderData(false);
    } else {
      setSolarOutput(placeholderOutput);
      setIsPlaceholderData(true);
    }
  }, [results, sunshineData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Chart data configuration
  const chartData = {
    labels: dateLabels,
    datasets: [{
      label: isPlaceholderData ? "Placeholder Solar Output (kWh)" : "Solar Output (kWh)",
      data: solarOutput,
      borderColor: isPlaceholderData ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)",
      backgroundColor: isPlaceholderData ? "rgba(255, 99, 132, 0.2)" : "rgba(75, 192, 192, 0.2)",
      fill: true,
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
  };

  return (
    <div className="line-chart-container">
      {isPlaceholderData && (
        <div className="placeholder-message">
          <p><strong>This is placeholder data.</strong> Run the simulation to see actual results.</p>
        </div>
      )}
      <div className="line-chart">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PanelOutputChart;
