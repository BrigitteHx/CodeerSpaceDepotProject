import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ data, options }) => {
  return (
    <div className="line-chart-container">
      <div className="line-chart-text">
        <h3>Daily Solar Output</h3>
        <p>
          This chart provides a detailed overview of the energy produced by your solar panels 
          over a 15-day simulation. The output is displayed in kilowatt-hours (kWh), showing how much 
          energy your solar panels generate each day based on the following factors:
        </p>
        <p>
          <strong>Number of Panels:</strong> The total number of solar panels in your system. 
          More panels generally lead to higher energy production.
        </p>
        <p>
          <strong>Panel Power:</strong> The power rating of each solar panel, measured in watts. 
          Higher-rated panels can produce more energy.
        </p>
        <p>
          <strong>Sunshine Hours:</strong> The average daily hours of sunlight your location receives. 
          More sunshine means more energy generated.
        </p>
        <p>
          <strong>Panel Efficiency:</strong> The efficiency of your panels in converting sunlight 
          into usable energy. Improving efficiency can boost output.
        </p>
      </div>
      <div className="line-chart">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
