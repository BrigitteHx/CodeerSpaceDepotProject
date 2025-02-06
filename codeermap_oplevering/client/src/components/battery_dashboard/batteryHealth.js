import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Paper, Box } from '@mui/material';

function BatteryHealth({efficiency}) {
  const lostCapacity = 100-efficiency;
  const remainingCapacity = efficiency;
  const data = {
    labels: ['Lost Capacity', 'Remaining Capacity'],
    datasets: [
      {
        data: [lostCapacity, remainingCapacity],
        backgroundColor: ['red', '#10ab02'],
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
