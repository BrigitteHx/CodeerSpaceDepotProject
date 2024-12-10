import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, LinearProgress, Radio, Button, Tooltip, Drawer, IconButton } from '@mui/material';
import axios from 'axios';
import BatteryChargingIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryUnknownIcon from '@mui/icons-material/BatteryUnknown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import EnergyUsageChart from './energyUsageChart';
import SavingsChart from './savingChart';
import BatteryHealth from './batteryHealth';
import Sidebar from './sidebar';
import "./style/batteryDashboard.css";

const BatteryDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [chargeStatus, setChargeStatus] = useState('charging');
  const [chargePercentage, setChargePercentage] = useState(75);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to fetch user data
  const fetchUserData = async () => {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
      const response = await axios.get('http://localhost:5000/api/user-info', {
        headers: {
          Authorization: token, // Send the token in the Authorization header
        },
      });
      setUserData(response.data.user); // Set the user data in the state
    } catch (error) {
      setError('Error fetching user data.');
      console.error('Error fetching user data:', error);
    }
  };

  const sendUserIdToBackend = async (userId) => {
    const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage

    const response = await fetch('http://localhost:5000/api/user-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Send the JWT token in the authorization header
      },
      body: JSON.stringify({ userId }), // Send the userId in the request body
    });

    const data = await response.json();

    if (response.ok) {
      console.log('User ID sent successfully:', data);
    } else {
      console.error('Error sending user ID:', data.message);
    }
  };

  const getBatteryIcon = () => {
    switch (chargeStatus) {
      case 'charging':
        return <BatteryChargingIcon style={{ fontSize: '100px', color: '#4caf50' }} />;
      case 'full':
        return <BatteryFullIcon style={{ fontSize: '100px', color: '#2196f3' }} />;
      default:
        return <BatteryUnknownIcon style={{ fontSize: '100px', color: '#9e9e9e' }} />;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Send user ID to backend when userData updates and has a valid ID
    if (userData && userData.id) {
      console.log('Received user ID:', userData.id); // Confirm userData.id is available
      sendUserIdToBackend(userData.id);
    }
  }, [userData]); // Re-run whenever userData changes

  // Toggle Sidebar Open/Close
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='battery-dashboard'>
    <Box sx={{ padding: '20px' }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
      >
        <Sidebar />
      </Drawer>

      {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Sidebar />
        </Grid>

      {/* Main Grid for Layout */}
      <Grid container spacing={3}>
        

        {/* Right Side: Energy Usage */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px', borderRadius: '20px' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Energy Usage
            </Typography>
            <EnergyUsageChart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px', borderRadius: '20px' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Savings
            </Typography>
            <SavingsChart />
          </Paper>
        </Grid>
      </Grid>
      

      {/* Savings Box */}
      <Grid container spacing={3} sx={{ marginTop: '20px' }}>

        {/* Battery Health Box */}
        <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', borderRadius: '20px', display: 'flex', flexDirection: 'column'  }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Battery Health</Typography>
              <div className='battery'>
                <BatteryHealth />
                <Box sx={{ textAlign: 'left', marginTop: '10px' }}>
                  <Typography>Battery condition: Normal</Typography>
                  <Typography>Maximum capacity: 85%</Typography>
                  <Typography>Number of cycles: 642</Typography>
                  <Typography>Production Date: March 2024</Typography>
                  <Typography>First Use Date: October 2024</Typography>
                </Box>
              </div>
              
            </Paper>
        </Grid>
        

        {/* Left Side: Battery Status */}
        <Grid item xs={12} md={6}>
                    {/* Small Boxes Under Battery Status */}
                    <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
            {/* Total Savings 30 Days */}
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ padding: '15px', textAlign: 'center', borderRadius: '20px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total Savings 30 Days
                </Typography>
                <Typography variant="h6" sx={{ color: '#4caf50', marginTop: '10px' }}>
                  €123,72
                </Typography>
              </Paper>
            </Grid>

            {/* Total Savings 7 Days */}
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ padding: '15px', textAlign: 'center', borderRadius: '20px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total Savings 7 Days
                </Typography>
                <Typography variant="h6" sx={{ color: '#2196f3', marginTop: '10px' }}>
                  €15,52
                </Typography>
              </Paper>
            </Grid>

            {/* Total Savings */}
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ padding: '15px', textAlign: 'center', borderRadius: '20px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total Savings
                </Typography>
                <Typography variant="h6" sx={{ color: '#ff9800', marginTop: '10px' }}>
                  €927,87
                </Typography>
              </Paper>
            </Grid> 
          </Grid>

          <Paper
            elevation={3}
            sx={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '20px'
            }}
          >
            {/* Battery Icon */}
            <Box sx={{ marginRight: '20px', textAlign: 'center' }}>
              {getBatteryIcon()}
            </Box>

            {/* Battery Status Info */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Battery Status
              </Typography>
              <Typography sx={{ marginTop: '8px', color: '#6c757d' }}>
                Estimated charging time: 3 hours
              </Typography>
              <LinearProgress
                variant="determinate"
                value={chargePercentage}
                sx={{ marginTop: '10px', height: '10px', borderRadius: '5px' }}
              />
              <Typography sx={{ marginTop: '8px', color: '#6c757d' }}>
                Capacity: {chargePercentage}% / 100%
              </Typography>
            </Box>

            {/* Controls under the battery */}
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio />
                <Typography>Automatically sell</Typography>
                <Tooltip title="Automatically sell excess energy back to the grid." arrow>
                  <HelpOutlineIcon
                    sx={{
                      marginLeft: '5px',
                      fontSize: '18px',
                      color: '#6c757d',
                      cursor: 'pointer',
                    }}
                  />
                </Tooltip>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#f44336',
                  color: '#fff',
                  marginTop: '10px',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                  },
                }}
              >
                Force Sell
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>

    </div>
  );
};

export default BatteryDashboard;
