import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useNavigate } from 'react-router-dom';
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

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

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

    const lineChartData = {
    labels: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"],
    datasets: [
      {
        label: "Energy Production (kWh)",
        data: [0,2,4,5,9,14,25,30,32,25,20,14,7,5,0],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

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
      {/* <button onClick={handleLogout}>Logout</button>
      <div>
        <h1>Welcome to the Homepage</h1>
        {error && <p>{error}</p>}
        {userData ? (
          <div>
            <p>User ID: {userData.id}</p>
            <p>Name: {userData.name}</p>
            <p>Email: {userData.email}</p>
            <p>Phone Number: {userData.phoneNumber}</p>
            <p>Location: {userData.location}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div> */}
      
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
            <h4>Energy Production Summary</h4>
            <Line
              data={lineChartData}
              options={lineChartOptions}
              style={{ height: "400px", width: "100%" }}
            />
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