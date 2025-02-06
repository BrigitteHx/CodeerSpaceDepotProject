import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useAuth } from "../AuthContext";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './style/SunHours.css';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SunshineHours = () => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const location = userData?.location;
  const [coordinates, setCoordinates] = useState(null);

  //userData?.location
  const geocodeLocation = async (location) => {
    const apiKey = "f3527a323e794d8a899c015c3196039e";  

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;  
        setCoordinates({ lat, lng });
      } else {
        console.error("No results found for the specified location."); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (location) {
      geocodeLocation(location);
    }
  }, [location]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!coordinates) return; 

      try {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today.setDate(today.getDate() + 15)).toISOString().split('T')[0];

        const params = {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "daylight_duration", "sunshine_duration", "uv_index_max"],
          timezone: 'auto',
          start_date: startDate,
          end_date: endDate,
        };

        const response = await axios.get('https://api.open-meteo.com/v1/forecast', { params });
        if (response.data && response.data.daily) {
          setWeatherData(response.data.daily);
        } else {
          console.error("API response does not contain daily data.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates]); 

  const formatChartData = () => {
    const dates = weatherData.time || [];
    const temperatureMax = weatherData.temperature_2m_max || [];
    const temperatureMin = weatherData.temperature_2m_min || [];
    const sunshineDuration = weatherData.sunshine_duration || [];

    const totalSunshineHours = sunshineDuration.reduce((total, duration) => total + duration, 0) / 3600; // Convert total seconds to hours

    const temperatureChartData = {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Max Temp (°C)',
          data: temperatureMax,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Min Temp (°C)',

          data: temperatureMin,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
      ],
    };

    const sunshineChartData = {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Sunshine Hours (hours)',
          data: sunshineDuration.map(seconds => (seconds / 3600).toFixed(2)),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
        },
      ],
    };

    return { temperatureChartData, sunshineChartData, totalSunshineHours };
  };

  return (
    <div className="sunshine-hours-container">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <div className="charts-container">
            <div className="chart-item">
              <h2>Max & Min Temperatures (Next 14 Days)</h2>
              <Line data={formatChartData().temperatureChartData} />
            </div>
            <div className="chart-item">
              <h2>Sunshine Hours (Next 14 Days)</h2>
              <Line data={formatChartData().sunshineChartData} />
            </div>
          </div>

          <div className="monthly-sunshine">
            <h3>Total Sunshine Hours for the Next 14 Days: {formatChartData().totalSunshineHours.toFixed(2)} hours</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunshineHours;
