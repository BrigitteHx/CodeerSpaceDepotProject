import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Paper, Box } from '@mui/material';
import { SimulationData } from '../simulation_dashboard/SimulationData';
import { calculateResults } from '../simulation_dashboard/simulationUtils';

function EnergyUsageChart() {
  const [chartData, setChartData] = useState(null);
  const { results, sunshineData, loading, error } = SimulationData(); 

  useEffect(() => {
    if (results && sunshineData) {
      // Calculate the results using simulationUtils.js
      const displayResults = calculateResults(results, sunshineData, [0.2, 0.3, 0.25], [1, 2, 1.5]);

      // Prepare data for chart display
      const labels = Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`);
      const solarOutput = displayResults.daily.solarOutput;
      const energyUsage = Array(15).fill(displayResults.daily.energyUsage);
      const gridUsage = energyUsage.map((usage, index) => usage - solarOutput[index]);

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Solar Energy (kWh)',
            data: solarOutput,
            borderColor: 'orange',
            fill: false,
          },
          {
            label: 'Grid Energy (kWh)',
            data: gridUsage,
            borderColor: 'red',
            fill: false,
          },
          {
            label: 'Home Usage (kWh)',
            data: energyUsage,
            borderColor: '#2196f3',
            fill: false,
          },
        ],
      };

      setChartData(data);
    }
  }, [results, sunshineData]);

  if (loading) return <div>Loading simulation data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box component={Paper} padding={2}>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <div>No data available for the simulation</div>
      )}
    </Box>
  );
}

export default EnergyUsageChart;
