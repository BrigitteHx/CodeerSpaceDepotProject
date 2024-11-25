import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Paper, Box } from '@mui/material';

function BatteryHealth() {
  const data = {
    labels: ['Used Capacity', 'Remaining Capacity'],
    datasets: [
      {
        data: [20, 80],
        backgroundColor: ['red', 'green'],
      },
    ],
  };

  return (
    <Box component={Paper} padding={2}>
      <Doughnut data={data} />
    </Box>
  );
}

export default BatteryHealth;
