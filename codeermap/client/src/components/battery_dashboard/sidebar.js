import React, { useState, useEffect } from 'react'; 
import { Drawer, Box, IconButton, Typography, List, ListItem, ListItemText, Divider, Tooltip } from '@mui/material';
import AddBattery from './AddBattery'; // Import the AddBattery component
import axios from 'axios';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InfoIcon from '@mui/icons-material/Info';

const Sidebar = () => {
  const [batteries, setBatteries] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const token = localStorage.getItem('authToken'); // Assuming you're storing the JWT token in localStorage

  useEffect(() => {
    const fetchBatteries = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/battery/readBatteries', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        });
        setBatteries(response.data);
      } catch (error) {
        setError('Error fetching batteries');
        console.error('Error fetching batteries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBatteries();
    } else {
      console.error('No token found');
    }
  }, [token]);

  const handleBatteryAdded = (newBattery) => {
    setBatteries((prevBatteries) => [...prevBatteries, newBattery]);
  };

  return (
    <>
      <IconButton 
        onClick={toggleDrawer} 
        sx={{ 
          position: 'fixed', 
          left: open ? '240px' : '0', 
          top: '20px', 
          zIndex: 1300, 
          backgroundColor: '#1976d2', 
          color: '#fff', 
          '&:hover': { backgroundColor: '#115293' }
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: '240px',
            boxSizing: 'border-box',
            backgroundColor: '#f7f9fc',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h6" sx={{ marginBottom: '20px', color: '#1976d2', fontWeight: 'bold',}}>
          Batteries
            <Tooltip title="This window displays the list of batteries you have added.  You can also add new batteries here.">
              <IconButton size="small" sx={{ marginLeft: '5px', color: '#1976d2' }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {batteries.map((battery) => (
                <ListItem key={battery.id} sx={{ padding: '10px', borderRadius: '5px', '&:hover': { backgroundColor: '#e3f2fd' } }}>
                  <ListItemText
                    primary={battery.name}
                    primaryTypographyProps={{ fontWeight: 'bold', color: '#1976d2' }}
                    secondary={
                      <>
                        Capacity: {battery.capacity} kWhs
                        <br />
                        Installed: {new Date(battery.installation_date).toLocaleDateString()}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Divider sx={{ marginTop: '20px', marginBottom: '10px' }} />
          <AddBattery onBatteryAdded={handleBatteryAdded} />
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;

