import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, LinearProgress, Radio, Button, Tooltip, Drawer, IconButton,Checkbox  } from '@mui/material';
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
import { SimulationData } from '../simulation_dashboard/SimulationData';
import { calculateResults } from '../simulation_dashboard/simulationUtils';
import { calculateChargingTime } from './chargeCalculator';
import "./style/batteryDashboard.css";



const BatteryDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [chargeStatus, setChargeStatus] = useState('charging');
  const [estimatedChargingTime, setEstimatedChargingTime] = useState("Calculating...");
  const [chargePercentage, setChargePercentage] = useState(75);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { results,sunshineData, loading } = SimulationData();
  const [batteryEfficiency, setBatteryEfficiency] = useState(null);
  const [adjustedCapacity, setAdjustedCapacity] = useState(null);
  const [maxCapacity, setMaxCapacity] = useState(null);
  const [batteryCondition, setBatteryCondition] = useState({ status: '', color: '' });
  const [savings, setSavings] = useState({ total7Days: 0.00, total30Days: 0.00, overallSavings: 0.00 });
  const [autoSell, setAutoSell] = useState(false);
  
  

  
  // Function to fetch user data
  const fetchUserData = async () => {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
      const response = await axios.get('http://localhost:5000/api/user/user-info', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
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

    const response = await fetch('http://localhost:5000/api/user/user-action', {
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
    if (results) {
      setBatteryEfficiency(results.battery_efficiency);
      setMaxCapacity(results.battery_capacity);  
    }
  }, [results]);
  useEffect(() => {
    if (batteryEfficiency !== null && maxCapacity !== null) {
      // Calculate adjusted capacity based on battery efficiency
      const adjusted = (maxCapacity * batteryEfficiency) / 100;
      setAdjustedCapacity(adjusted);
      if (batteryEfficiency > 80) {
        setBatteryCondition({ status: 'Good', color: 'green' });
      } else if (batteryEfficiency > 30) {
        setBatteryCondition({ status: 'Normal', color: 'orange' });
      } else if (batteryEfficiency > 10) {
        setBatteryCondition({ status: 'Bad', color: 'red' });
      } else {
        setBatteryCondition({ status: 'Critical', color: 'darkred' });
      }
    }
  }, [batteryEfficiency, maxCapacity]);
  useEffect(() => {
    if (results && sunshineData) {
      const displayResults = calculateResults(results, sunshineData, [0.2, 0.25, 0.22], [1, 2, 1.5]);

        // Calculate daily savings and ensure numeric values
        const dailySavingsArray = Array.from({ length: 15 }, (_, i) => {
        const dailySaving = Number(displayResults.daily?.savings ?? 0);
        return isNaN(dailySaving) ? 0 : dailySaving;
      });

      const total7Days = dailySavingsArray.slice(0, 7).reduce((sum, savings) => sum + savings, 0);
      const total30Days = dailySavingsArray.reduce((sum, savings) => sum + savings, 0) * 2;
      const overallSavings = Number(displayResults.fifteenDay?.savings ?? 0);

      setSavings({
        total7Days: Number.isFinite(total7Days) ? total7Days.toFixed(2) : "0.00",
        total30Days: Number.isFinite(total30Days) ? total30Days.toFixed(2) : "0.00",
        overallSavings: Number.isFinite(overallSavings) ? overallSavings.toFixed(2) : "0.00",
        });
    }
  }, [results, sunshineData]);

  useEffect(() => {
    if (results && sunshineData) {
      const displayResults = calculateResults(results, sunshineData, [0.2, 0.25, 0.22], [1, 2, 1.5]);

      // For this example, we're using the first day's solar output and home usage
      const solarOutput = displayResults.daily.solarOutput[0]; 
      const homeUsage = displayResults.daily.energyUsage;

      const batteryCapacity = results.battery_capacity;
      const currentChargeLevel = (chargePercentage / 100) * batteryCapacity;

      const chargingTime = calculateChargingTime({
        solarOutput,
        homeUsage,
        batteryCapacity,
        currentChargeLevel,
      });

      setEstimatedChargingTime(chargingTime);
    }
  }, [results, sunshineData, chargePercentage]);
  useEffect(() => {
    // Send user ID to backend when userData updates and has a valid ID
    if (userData && userData.id) {
      console.log('Received user ID:', userData.id); // Confirm userData.id is available
      sendUserIdToBackend(userData.id);
    }
  }, [userData]); // Re-run whenever userData changes

  const handleCheckboxChange = () => {
    setAutoSell(!autoSell);
    console.log("Automatically sell set to:", !autoSell);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!batteryEfficiency || adjustedCapacity === null) return <Typography>No battery efficiency data available. Run a simulation first.</Typography>;
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

      {/* Sidebar
        <Grid item xs={12} md={3}>
          <Sidebar />
        </Grid> */}

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
                <BatteryHealth efficiency={batteryEfficiency}/>
                <Box sx={{ textAlign: 'left', marginTop: '10px' }}>
                  <Typography >Battery condition: <span style={{ color: batteryCondition.color }}>{batteryCondition.status}</span></Typography>
                  <Typography>Original capacity: {maxCapacity} kWh</Typography>
                  <Typography>Current capacity: {adjustedCapacity} kWh</Typography>
                  <Typography>Battery efficiency: {batteryEfficiency}%</Typography>
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
                  Estimated Savings 30 Days
                </Typography>
                <Typography variant="h6" sx={{ color: '#4caf50', marginTop: '10px' }}>
                €{savings.total30Days}
                </Typography>
              </Paper>
            </Grid>

            {/* Total Savings 7 Days */}
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ padding: '15px', textAlign: 'center', borderRadius: '20px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Estimated Savings 15 Days
                </Typography>
                <Typography variant="h6" sx={{ color: '#2196f3', marginTop: '10px' }}>
                €{savings.overallSavings}
                </Typography>
              </Paper>
            </Grid>

            {/* Total Savings */}
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ padding: '15px', textAlign: 'center', borderRadius: '20px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Estimated Savings 7 Days
                </Typography>
                <Typography variant="h6" sx={{ color: '#ff9800', marginTop: '10px' }}>
                €{savings.total7Days}
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
                Estimated charging time: {estimatedChargingTime}
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
                <Checkbox
                  checked={autoSell}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
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
