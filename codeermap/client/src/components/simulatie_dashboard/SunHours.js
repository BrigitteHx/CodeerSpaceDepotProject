import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./style/SunHours.css";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SunshineHours = () => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const params = {
          latitude: 51.808,
          longitude: 4.582,
          daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'sunrise',
            'sunset',
            'daylight_duration',
            'sunshine_duration', 
            'uv_index_max',
            'uv_index_clear_sky_max',
          ],
          timezone: 'auto',
        };
    
        const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
          params,
          timeout: 10000, // 10 seconds
        });
    
        if (response.data && response.data.daily) {
          setWeatherData(response.data.daily);
        } else {
          console.error('No daily data found in the API response.');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  // Helper function to convert seconds to hours and minutes
  const convertToHoursAndMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Convert seconds to hours
    const minutes = Math.floor((seconds % 3600) / 60); // Convert remaining seconds to minutes
    return `${hours} hours ${minutes} minutes`;
  };

  // Helper function to format data for the charts
  const formatChartData = () => {
    const dates = weatherData.time || [];
    const temperatureMax = weatherData.temperature_2m_max || [];
    const temperatureMin = weatherData.temperature_2m_min || [];
    const uvIndexMax = weatherData.uv_index_max || [];

    // Max/Min Temperature chart
    const temperatureChartData = {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Max Temperature (°C)',
          data: temperatureMax,
          fill: false,
          backgroundColor: '#ff6347',
          borderColor: '#ff6347',
          tension: 0.4,
        },
        {
          label: 'Min Temperature (°C)',
          data: temperatureMin,
          fill: false,
          backgroundColor: '#1e90ff',
          borderColor: '#1e90ff',
          tension: 0.4,
        },
      ],
    };

    // UV Index chart
    const uvIndexChartData = {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'UV Index Max',
          data: uvIndexMax,
          fill: false,
          backgroundColor: '#ffcc00',
          borderColor: '#ffcc00',
          tension: 0.4,
        },
      ],
    };

    return { temperatureChartData, uvIndexChartData };
  };

  return (
    <div className="sunshine-hours-container">
      <h1>Sunshine Hours and Weather Data</h1>
      {loading ? (
        <p>Loading weather data...</p>
      ) : (
        <div>
          {/* Side-by-side charts */}
          <div className="charts-container">
            <div className="chart-item">
              <h2>Max and Min Temperatures (°C)</h2>
              {weatherData.time ? (
                <Line
                  data={formatChartData().temperatureChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                      },
                    },
                    scales: {
                      x: {
                        title: { display: true, text: 'Date' },
                        ticks: { autoSkip: true, maxRotation: 45, minRotation: 45 },
                      },
                      y: { title: { display: true, text: 'Temperature (°C)' }, beginAtZero: false },
                    },
                  }}
                />
              ) : (
                <p>No data available for temperature.</p>
              )}
            </div>

            <div className="chart-item">
              <h2>UV Index Max</h2>
              {weatherData.time ? (
                <Line
                  data={formatChartData().uvIndexChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: true } },
                    scales: {
                      x: { title: { display: true, text: 'Date' }, ticks: { autoSkip: true, maxRotation: 45, minRotation: 45 } },
                      y: { title: { display: true, text: 'UV Index' }, beginAtZero: false },
                    },
                  }}
                />
              ) : (
                <p>No data available for UV Index.</p>
              )}
            </div>
          </div>

          {/* Table for Sunshine Duration */}
          <div className="sunshine-duration-table">
            <h2>Sunshine Duration for the Next 7 Days</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sunshine Duration</th>
                  <th>Sunrise</th>
                  <th>Sunset</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.time && weatherData.time.map((date, index) => {
                    const sunshineDurationSeconds = weatherData.sunshine_duration[index];
                    const sunshineDurationFormatted = sunshineDurationSeconds > 0
                    ? convertToHoursAndMinutes(sunshineDurationSeconds)
                    : "No sunshine data";  // Handle zero or missing sunshine duration
                    const sunriseTime = weatherData.sunrise[index];
                    const sunsetTime = weatherData.sunset[index];

                    const sunriseFormatted = new Date(sunriseTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const sunsetFormatted = new Date(sunsetTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                    <tr key={index}>
                        <td>{new Date(date).toLocaleDateString()}</td>
                        <td>{sunshineDurationFormatted}</td>
                        <td>{sunriseFormatted}</td>
                        <td>{sunsetFormatted}</td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
          </div>

          {/* Data source attribution */}
          <div className="attribution">
            <p>Data provided by Open Meteo</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunshineHours;
