import React from 'react';
import { Box, Typography, LinearProgress, Button, Paper } from '@mui/material';

function BatteryStatus() {
  return (
    <Box component={Paper} padding={2}>
      <Typography variant="h6">Battery Status</Typography>
      <LinearProgress variant="determinate" value={35} />
      <Typography>Capacity: 153 / 20 kWh</Typography>
      <Button variant="contained" color="secondary">Force Sell</Button>
    </Box>
  );
}

export default BatteryStatus;
