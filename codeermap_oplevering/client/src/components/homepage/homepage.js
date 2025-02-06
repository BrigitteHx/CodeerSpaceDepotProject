import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useParams, useNavigate} from "react-router-dom";
import PanelOutputChart from "./PanelOutputChart";
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./style/homepage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Homepage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState([]); // State for weather data

  const [dynamicPrices] = useState([0.20, 0.22, 0.18, 0.25, 0.24, 0.21, 0.19, 0.23, 0.22, 0.20, 0.21, 0.19, 0.22, 0.23, 0.24, 0.25, 0.26, 0.22, 0.20, 0.18, 0.22, 0.21, 0.19, 0.20]);
  const defaultUsage = [
    0.2, 0.3, 0.3, 0.2, 0.3, 0.3, 0.7, 1.2, 1.5, 1.8, 1.5, 1.2,
    1.0, 1.2, 1.4, 1.8, 2.0, 2.5, 1.8, 1.5, 1.2, 0.8, 0.6, 0.5,
  ];
  const [hourlyUsage, setHourlyUsage] = useState(defaultUsage);
  const { userId } = useParams();
  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    try {
      const response = await axios.get('http://localhost:5000/api/user/user-info', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      setUserData(response.data); // Set the user data in the state
    } catch (error) {
      setError('Error fetching user data.');
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const api = "869cf6856a8ef54c9d6a541b3675ffe7"; // Replace with your actual API key

  // Function to fetch 5-day weather data
  const getDatafor7days = async (location) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api}&units=metric&lang=en`;
    try {
      let res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      let data = await res.json();
      const dailyData = data.list.filter((_, index) => index % 8 === 0); // Get 1 entry per day (every 8th entry)
      console.log("data : "+ dailyData )
      setWeatherData(dailyData); // Set the daily weather data
    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
  };

  // Fetch weather data when userData is available
  useEffect(() => {
    if (userData?.location) {
      getDatafor7days(userData.location);
      
    }
  }, [userData]);

  const pieChartData = {
    labels: ["Used Energy", "Available Energy"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#f89820", "#98a2c6"],
        hoverBackgroundColor: ["#f89800", "#36A2EB"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Map of weather condition to image URL
  const weatherImages = {
    "Clear": "https://cdn-icons-png.flaticon.com/128/869/869869.png",
    "Clouds": "https://cdn-icons-png.flaticon.com/128/414/414927.png",
    "Rain": "https://cdn-icons-png.flaticon.com/128/4735/4735072.png",
  };

  return (
    <div className="homepage">
      
      <div className="box-1 bg-primary text-white text-center p-5">
        <h1>Welcome, {userData ? userData.name : "User"}!</h1>
        <p>
          You have successfully logged in. This is your personal dashboard where
          you can manage all important data about your solar energy production
          and battery status. Use the navigation to explore different sections,
          or check your energy performance directly below.
        </p>
      </div>

      <div className="container charts-container my-4">
        <div className="homepage-charts-row">
          <div className="col-md-4 chart-box">
            <h4>Solar Energy Production</h4>
            <PanelOutputChart userId={userId} dynamicPrices={dynamicPrices} hourlyUsage={hourlyUsage} />
          </div>

          <div className="col-md-4 chart-box">
            <h4>Current Battery Status</h4>
            <Pie
              data={pieChartData}
              options={pieChartOptions}
              style={{ height: "400px", width: "100%" }}
            />
          </div>

          <div className="col-md-4 chart-box">
            <h4>5-day Weather Forecast</h4>
            <div className="weather-forecast">
              {weatherData.length > 0 ? (
                weatherData.map((day, index) => {
                  const condition = day.weather[0].main; // Get the weather condition
                  return (
                    <div key={index} className="weather-day">
                      <strong>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'numeric' })}</strong> {/* Format date */}
                      <br />
                      {condition === "Clear" && (
                        <img src={weatherImages["Clear"]} alt="Clear Sky" />
                      )}
                      {condition === "Clouds" && (
                        <img src={weatherImages["Clouds"]} alt="Clouds" />
                      )}
                      {condition === "Rain" && (
                        <img src={weatherImages["Rain"]} alt="Rain" />
                      )}
                      <br />
                      <span>{Math.round(day.main.temp)}°C</span> {/* Temperature */}
                      <br />
                      <span>{day.weather[0].description}</span> {/* Weather description */}
                      
                    </div>
                    
                  );
                  
                })
              ) : (
                <p>Loading weather data...</p>
                
              )}
            </div>
            <a className= "bron_link" href="https://dashboard.openweather.co.uk/">Bron: openweather</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;