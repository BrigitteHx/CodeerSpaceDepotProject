import React from 'react';
import { Line } from 'react-chartjs-2';
import { Paper, Box } from '@mui/material';

function EnergyUsageChart() {
  const data = {
    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [
      {
        label: 'Solar Energy',
        data: [30, 45, 40, 60, 50, 70, 55, 65],
        borderColor: 'orange',
        fill: false,
      },
      {
        label: 'Home Usage',
        data: [20, 35, 30, 50, 40, 60, 45, 55],
        borderColor: 'red',
        fill: false,
      },
    ],
  };

  return (
    <Box component={Paper} padding={2}>
      <Line data={data} />
    </Box>
  );
}

export default EnergyUsageChart;
