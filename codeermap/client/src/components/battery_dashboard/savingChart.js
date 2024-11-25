import React from 'react';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Paper, Box } from '@mui/material';
Chart.register(BarElement, CategoryScale, LinearScale);

function SavingsChart() {
  const data = {
    labels: ['01 Aug', '05 Aug', '10 Aug', '15 Aug', '20 Aug', '25 Aug', '30 Aug'],
    datasets: [
      {
        label: 'Savings (€)',
        data: [10, 15, 12, 20, 18, 25, 22],
        backgroundColor: 'orange',
      },
    ],
  };

  return (
    <Box component={Paper} padding={2}>
      <Bar data={data} />
    </Box>
  );
}

export default SavingsChart;
