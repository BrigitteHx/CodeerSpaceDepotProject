import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "./style/EnergyPrices.css";

const todayURL = `http://localhost:5000/api/today-prices`;
const monthURL = `http://localhost:5000/api/monthly-prices`;

const EnergyPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('monthly'); // Default to monthly data

  // Fetch prices based on selected time period
  useEffect(() => {
    const fetchData = async () => {
      let url;
      if (timePeriod === 'today') {
        url = todayURL;
      } else {
        url = monthURL;
      }

      try {
        const res = await axios.get(url);

        if (Array.isArray(res.data?.data)) {
          setPrices(res.data.data);
        } else {
          console.error("Data is not an array:", res.data?.data);
        }
      } catch (error) {
        console.error("Error fetching energy prices:", error.response || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  // Format chart data
  const formatChartData = (prices) => ({
    labels: prices.map((item) => item.datum.split(" ")[0]), // Use `datum` for date and split to remove time
    datasets: [
      {
        label: "Energieprijs (€ / kWh)",
        data: prices.map((item) => parseFloat(item.prijs)), // Use `prijs` for price
        fill: false,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        tension: 0.4,
      },
    ],
  });

  return (
    <div className="energy-prices-container">
      <h1>Energy Prices Overview</h1>

      {/* Time period selection */}
      <div className="time-period-selector">
        <button onClick={() => setTimePeriod('today')} className={timePeriod === 'today' ? 'active' : ''}>
          Today's Prices
        </button>
        <button onClick={() => setTimePeriod('monthly')} className={timePeriod === 'monthly' ? 'active' : ''}>
          Last Month's Prices
        </button>
      </div>

      {loading ? (
        <p>Loading energy prices...</p>
      ) : (
        <>
          <div className="chart-container">
            <h2>{`${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Electricity Prices`}</h2>
            {prices.length ? (
              <Line
                data={formatChartData(prices)}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: {
                    x: {
                      title: { display: true, text: "Date" },
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                      },
                    },
                    y: {
                      title: { display: true, text: "Price (€ / kWh)" },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p>No data available for the selected time period.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EnergyPrices;
