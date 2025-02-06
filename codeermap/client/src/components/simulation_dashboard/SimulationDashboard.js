import React, { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import "./style/SimulationDashboard.css";
import ResultsSummary from './ResultsSummary';
import Advice from './Advice';
import RadarChart from './BarChart';
import LineChart from './LineChart';
import CircularProgress from './CircularProgress';
import { calculateResults } from './simulationUtils';
import NoData from './NoData';
import { SimulationData } from './SimulationData';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, RadialLinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, RadialLinearScale, Tooltip, Legend);

const SimulationDashboard = () => {
  const [simulationData, setSimulationData] = useState(null);
  
  const navigate = useNavigate();
  const { userId } = useParams();

  const [dynamicPrices] = useState([0.20, 0.22, 0.18, 0.25, 0.24, 0.21, 0.19, 0.23, 0.22, 0.20, 0.21, 0.19, 0.22, 0.23, 0.24, 0.25, 0.26, 0.22, 0.20, 0.18, 0.22, 0.21, 0.19, 0.20]);
  const defaultUsage = [
    0.2, 0.3, 0.3, 0.2, 0.3, 0.3, 0.7, 1.2, 1.5, 1.8, 1.5, 1.2,
    1.0, 1.2, 1.4, 1.8, 2.0, 2.5, 1.8, 1.5, 1.2, 0.8, 0.6, 0.5,
  ];
  const [hourlyUsage, setHourlyUsage] = useState(defaultUsage);

  const { results, sunshineData, loading, error } = SimulationData(userId);

  const today = new Date();
  const dateLabels = Array.from({ length: 15 }, (_, i) => {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    return nextDay.toLocaleDateString('en-GB');
  });    

  const displayResults = results && sunshineData ? calculateResults(results, sunshineData, dynamicPrices, hourlyUsage) : null;
  if (!displayResults) return <NoData navigate={navigate} />;
  
  if (loading) {
    return <div>Loading...</div>;
  } if (error) {
    return <div>{error}</div>;
  }
  
  // Chart Data
  const chartData = {
    solarOutputData: {
      labels: dateLabels,
      datasets: [{
        label: "Solar Output (kWh)",
        data: displayResults.daily.solarOutput.map(output => output),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
      }],
    },
    doughnutData: {
      labels: ["Total Energy Usage (kWh)", "Total Panel Output (kWh)"],
      datasets: [{
        label: "Energy Usage vs Panel Output",
        data: [
          displayResults.fifteenDay.energyUsage, 
          displayResults.fifteenDay.panelOutput
        ],
        backgroundColor: ["#FF5722", "#4CAF50"],
        hoverOffset: 4,
      }],
    },
    radarData: {
      labels: ["Energy Usage (kWh)", "Panel Output (kWh)", "Savings (€)"],
      datasets: [{
        label: "15-Day Performance",
        data: [displayResults.fifteenDay.energyUsage, displayResults.fifteenDay.panelOutput, displayResults.fifteenDay.savings],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(255, 159, 64, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 2,
        tension: 0.3,
      }],
    },
  };
  
  const tooltipOptions = {
    tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(2)} kWh` } }
  };
  
  return (
    <div className="simulation-dashboard">
      <ResultsSummary displayResults={displayResults} />
      <Advice results={results} displayResults={displayResults} />

      <div>
        <LineChart data={chartData.solarOutputData} options={tooltipOptions} />
      </div>
      <div className="results-container">
        <div className="chart-container">
          <RadarChart data={displayResults.fifteenDay} />
        </div>
        <div className="chart-container">
          <CircularProgress panelOutput={displayResults.daily.panelOutput} energyUsage={displayResults.daily.energyUsage} />
        </div>
      </div>

    </div>
  );
};

export default SimulationDashboard;