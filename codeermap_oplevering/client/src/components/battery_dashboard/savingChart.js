import React, { useEffect, useState } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Paper, Box } from '@mui/material';
import { SimulationData } from '../simulation_dashboard/SimulationData';
import { calculateResults } from '../simulation_dashboard/simulationUtils';

Chart.register(BarElement, CategoryScale, LinearScale);

function SavingsChart() {
  const [chartData, setChartData] = useState(null);
  const { results, sunshineData, loading, error } = SimulationData(); // Fetch simulation data

  useEffect(() => {
    if (results && sunshineData) {
      const displayResults = calculateResults(results, sunshineData, [0.2, 0.25, 0.22], Array(24).fill(1)); // Debug example

      const dailySavings = displayResults.daily.savingsList.map(item => parseFloat(item.savings) || 0);
      
      // Prepare chart data
      const data = {
        labels: Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: 'Savings (€)',
            data: dailySavings,
            backgroundColor: 'rgba(255, 165, 0, 0.6)', // Adjusted for better visibility
            borderColor: 'orange',
            borderWidth: 1,
          },
        ],
      };
  
      setChartData(data);
    }
  }, [results, sunshineData]);

  if (loading) return <div>Loading savings data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box component={Paper} padding={2}>
      {chartData ? (
        <Bar data={chartData} options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }} />
      ) : (
        <div>No data available for savings</div>
      )}
    </Box>
  );
}

export default SavingsChart;
