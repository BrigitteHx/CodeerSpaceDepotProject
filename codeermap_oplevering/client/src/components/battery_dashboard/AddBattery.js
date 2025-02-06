import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import Swal from 'sweetalert2'
import './style/batteryDashboard.css';


const AddBattery = ({ onBatteryAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    installationDate: null,
  });
  const [errors, setErrors] = useState({
    name: '',
    capacity: '',
    installationDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };
const handleDateChange = (newValue) => {
  // newValue is a dayjs object (or null)
  setFormData((prev) => ({
    ...prev,
    installationDate: newValue,
  }));
  setErrors((prev) => ({
    ...prev,
    installationDate: '',
  }));
};
  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = {
        name: '',
        capacity: '',
        installationDate: '',
      };
    if (!formData.name) newErrors.name = 'Battery name is required.';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required.';
    
    // Check if the capacity field contains only numbers and optional unit (e.g., '5000mAh')
    if (formData.capacity && !/^\d{1,9}[a-zA-Z]{0,3}$/.test(formData.capacity)) {
      newErrors.capacity = 'Capacity must include up to 9 digits followed by up to 3 letters (e.g., "5000mAh").';
    }
    if (!formData.installationDate) newErrors.installationDate = 'Installation date is required.';

    if (newErrors.name || newErrors.capacity || newErrors.installationDate) {
        setErrors(newErrors);
        return;
      }
    const token = localStorage.getItem('authToken');  // Assuming you're storing the JWT token in localStorage

    if (!token) {
        console.error('No token found');
        return;
    }
    const clearForm = () => {
        setFormData({
          name: '',
          capacity: '',
          installationDate: null,
        });
      };

    try {
        const response = await axios.post('http://localhost:5000/api/battery/addBattery', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the token here
            },
        });
        console.log('Battery added:', response.data);
        setOpen(false);
        clearForm();
        Swal.fire({
            title: 'Success!',
            text: 'Battery added successfully',
            icon: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'ok-button-battery',
            },
            buttonsStyling: false,
            background: 'white'
          }).then(() => {
            window.location.reload();
    });
    } catch (error) {
        console.error('Error adding battery:', error);
    }
};

  return (
    <>
       <IconButton
        onClick={() => setOpen(true)}
        color="primary"
        sx={{ marginTop: '10px', right: '0%' }}
      >
        <AddIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Battery</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Battery Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            label="Capacity (e.g., 5000mAh)"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.capacity)}
            helperText={errors.capacity}

          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker  
            format="DD-MM-YYYY"
            slotProps={{
                openPickerButton: {
                },
                inputAdornment: {
                  position: 'start',
                },  
              }}
            sx={{ marginTop: '10px', width: '100% !important' }}
              label="Installation Date"
              value={formData.installationDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField sx={{ marginTop: '10px', width: '100% !important' }}
                  {...params}
                  margin="dense"
                  error={Boolean(errors.installationDate)}
                  helperText={errors.installationDate}
                />
              )}
              disablePortal
              PopperProps={{
                placement: "right-start",
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button className="cancel-button-battery" onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button className="add-button-battery" onClick={handleSubmit} sx={{ color: '#0ee315' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddBattery;

