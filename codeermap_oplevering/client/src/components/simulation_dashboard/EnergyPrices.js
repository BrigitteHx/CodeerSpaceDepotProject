
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EnergyPrices = () => {
  const [dynamicPrices] = useState([
    0.20, 0.22, 0.18, 0.25, 0.24, 0.21, 0.19, 0.23, 0.22, 0.20, 0.21, 0.19,
    0.22, 0.23, 0.24, 0.25, 0.26, 0.22, 0.20, 0.18, 0.22, 0.21, 0.19, 0.20,
  ]);

  const defaultUsage = [
    0.5, 0.5, 0.4, 0.4, 0.3, 0.3, 0.7, 1.2, 1.5, 1.8, 1.5, 1.2,
    1.0, 1.2, 1.4, 1.8, 2.0, 2.2, 1.8, 1.5, 1.2, 0.8, 0.6, 0.5,
  ];

  const [hourlyUsage, setHourlyUsage] = useState(defaultUsage);
  const [preset, setPreset] = useState("average");

  // Function to calculate cost
  const calculateCost = (prices, usage) =>
    prices.reduce((total, price, index) => total + price * usage[index], 0);

  const dailyEnergyCost = calculateCost(dynamicPrices, hourlyUsage);
  const monthlyEnergyCost = dailyEnergyCost * 30;

  // Generate cost for 15 days
  const generateCostDataFor15Days = () => {
    const dailyCosts = [];
    for (let i = 0; i < 15; i++) {
      const randomPrices = dynamicPrices.map(price => price + (Math.random() * 0.1 - 0.05));
      const costForDay = calculateCost(randomPrices, defaultUsage);
      dailyCosts.push(costForDay);
    }
    return dailyCosts;
  };

  // Generate hourly cost data for one day
  const generateHourlyCostDataForOneDay = () => {
    return dynamicPrices.map((price, index) => price * hourlyUsage[index]);
  };

  const dailyCostData = generateCostDataFor15Days();
  const hourlyCostData = generateHourlyCostDataForOneDay();

  // Chart configurations for daily and hourly costs
  const dailyCostChartData = {
    labels: Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Daily Energy Cost (€)',
        data: dailyCostData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const hourlyCostChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Hourly Energy Cost (€)',
        data: hourlyCostData,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const handlePresetChange = (preset) => {
    setPreset(preset);
    switch (preset) {
      case "low":
        setHourlyUsage(Array(24).fill(0.5));
        break;
      case "high":
        setHourlyUsage(Array(24).fill(2.5)); 
        break;
      case "average":
      default:
        setHourlyUsage(defaultUsage); // Average usage'
    }
  };

  return (
    <div>
      <h1>Energy Cost Calculator</h1>
      <h2>Daily Energy Cost: €{dailyEnergyCost.toFixed(2)}</h2>
      <h2>Monthly Energy Cost: €{monthlyEnergyCost.toFixed(2)}</h2>

      <h3>Select a preset:</h3>
      <button onClick={() => handlePresetChange("low")}>Low Usage</button>
      <button onClick={() => handlePresetChange("average")}>Average Usage</button>
      <button onClick={() => handlePresetChange("high")}>High Usage</button>

      <h3>Chart 1: Energy Costs for 15 Days</h3>
      <Line data={dailyCostChartData} />

      <h3>Chart 2: Hourly Energy Costs for One Day</h3>
      <Line data={hourlyCostChartData} />
    </div>
  );
};

export default EnergyPrices;

// import React, { useState } from "react";

// const EnergyPrices = () => {
//   const [dynamicPrices] = useState([
//     0.20, 0.22, 0.18, 0.25, 0.24, 0.21, 0.19, 0.23, 0.22, 0.20, 0.21, 0.19,
//     0.22, 0.23, 0.24, 0.25, 0.26, 0.22, 0.20, 0.18, 0.22, 0.21, 0.19, 0.23,
//   ]);

//   const defaultUsage = [
//     0.5, 0.5, 0.4, 0.4, 0.3, 0.3, 0.7, 1.2, 1.5, 1.8, 1.5, 1.2,
//     1.0, 1.2, 1.4, 1.8, 2.0, 2.2, 1.8, 1.5, 1.2, 0.8, 0.6, 0.5,
//   ];

//   const [hourlyUsage, setHourlyUsage] = useState(defaultUsage);
//   const [preset, setPreset] = useState("average"); // Default preset

//   // Array met tijdsindeling
//   const hours = Array.from({ length: 24 }, (_, i) => {
//     const hour = i.toString().padStart(2, "0");
//     return `${hour}:00`;
//   });

//   const calculateCost = (prices, usage) =>
//     prices.reduce((total, price, index) => total + price * usage[index], 0);

//   const dailyEnergyCost = calculateCost(dynamicPrices, hourlyUsage);
//   const monthlyEnergyCost = dailyEnergyCost * 30;

//   const handlePresetChange = (preset) => {
//     setPreset(preset);
//     switch (preset) {
//       case "low":
//         setHourlyUsage(Array(24).fill(0.5)); // Laag verbruik
//         break;
//       case "high":
//         setHourlyUsage(Array(24).fill(2.0)); // Hoog verbruik
//         break;
//       case "average":
//       default:
//         setHourlyUsage(defaultUsage); // Gemiddeld verbruik
//     }
//   };

//   const handleHourlyUsageChange = (index, value) => {
//     const updatedUsage = [...hourlyUsage];
//     updatedUsage[index] = value;
//     setHourlyUsage(updatedUsage);
//   };

//   return (
//     <div>
//       <h1>Energiekosten Calculator</h1>
//       <h2>Dagelijkse Energiekosten: €{dailyEnergyCost.toFixed(2)}</h2>
//       <h2>Maandelijkse Energiekosten: €{monthlyEnergyCost.toFixed(2)}</h2>

//       <h3>Kies een voorinstelling:</h3>
//       <button onClick={() => handlePresetChange("low")}>Laag Verbruik</button>
//       <button onClick={() => handlePresetChange("average")}>Gemiddeld Verbruik</button>
//       <button onClick={() => handlePresetChange("high")}>Hoog Verbruik</button>

//       <h3>Pas specifieke uren aan:</h3>
//       {hourlyUsage.map((usage, index) => (
//         <div key={index}>
//           <label>{hours[index]}: </label>
//           <input
//             type="range"
//             min="0"
//             max="5"
//             step="0.1"
//             value={usage}
//             onChange={(e) => handleHourlyUsageChange(index, parseFloat(e.target.value))}
//           />
//           <span>{usage} kWh</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default EnergyPrices;


// Enrgy Prices API page:
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import "./style/EnergyPrices.css";

// const todayURL = `http://localhost:5000/api/today-prices`;
// const monthURL = `http://localhost:5000/api/monthly-prices`;

// const EnergyPrices = ({ onTodayPriceUpdate }) => {
//   const [prices, setPrices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [timePeriod, setTimePeriod] = useState('monthly');

//   useEffect(() => {
//     const fetchData = async () => {
//       let url;
//       if (timePeriod === 'today') {
//         url = todayURL;
//       } else {
//         url = monthURL;
//       }

//       try {
//         const res = await axios.get(url);

//         if (Array.isArray(res.data?.data)) {
//           setPrices(res.data.data);
//         } else {
//           console.error("Data is not an array:", res.data?.data);
//         }
//       } catch (error) {
//         console.error("Error fetching energy prices:", error.response || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [timePeriod]);

//   // Calculate the average price for the day
//   const calculateAveragePrice = (prices) => {
//     const totalPrice = prices.reduce((acc, item) => acc + parseFloat(item.prijs), 0);
//     return (totalPrice / prices.length).toFixed(6);
//   };

//   useEffect(() => {
//     if (timePeriod === 'today' && prices.length > 0) {
//       const avgPrice = calculateAveragePrice(prices);
//       onTodayPriceUpdate(parseFloat(avgPrice)); 
//     }
//   }, [prices, timePeriod, onTodayPriceUpdate]);

//   // Group by date and calculate the average price per day for monthly data
//   const groupByDate = (prices) => {
//     const groupedPrices = prices.reduce((acc, item) => {
//       const date = item.datum.split(" ")[0]; // Get the date part (YYYY-MM-DD)
//       const price = parseFloat(item.prijs);

//       if (!acc[date]) {
//         acc[date] = { total: price, count: 1 };
//       } else {
//         acc[date].total += price;
//         acc[date].count += 1;
//       }
//       return acc;
//     }, {});

//     // Calculate average price for each date
//     return Object.keys(groupedPrices).map((date) => ({
//       datum: date,
//       prijs: (groupedPrices[date].total / groupedPrices[date].count).toFixed(6),
//     }));
//   };

//   // Format chart data
//   const formatChartData = (prices) => {
//     const groupedPrices = timePeriod === 'monthly' ? groupByDate(prices) : prices;

//     return {
//       labels: groupedPrices.map((item) => {
//         if (timePeriod === 'today') {
//           return item.datum.split(" ")[1]; // Only show time (hour:minute)
//         }
//         return item.datum; // For monthly, show the full date
//       }),
//       datasets: [
//         {
//           label: "Energieprijs (€ / kWh)",
//           data: groupedPrices.map((item) => parseFloat(item.prijs)), // Use `prijs` for price
//           fill: false,
//           backgroundColor: "#007bff",
//           borderColor: "#007bff",
//           tension: 0.4,
//         },
//       ],
//     };
//   };

//   return (
//     <div className="energy-prices-container">
//       <h1>Energy Prices Overview</h1>

//       {/* Time period selection */}
//       <div className="time-period-selector">
//         <button onClick={() => setTimePeriod('today')} className={timePeriod === 'today' ? 'active' : ''}>
//           Today's Prices
//         </button>
//         <button onClick={() => setTimePeriod('monthly')} className={timePeriod === 'monthly' ? 'active' : ''}>
//           Last Month's Prices
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading energy prices...</p>
//       ) : (
//         <>
//           <div className="chart-container">
//             <h2>{`${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Electricity Prices`}</h2>
//             {prices.length ? (
//               <Line
//                 data={formatChartData(prices)}
//                 options={{
//                   responsive: true,
//                   plugins: { legend: { display: true } },
//                   scales: {
//                     x: {
//                       title: { display: true, text: timePeriod === 'today' ? "Time (HH:mm)" : "Date" },
//                       ticks: {
//                         autoSkip: true,
//                         maxRotation: 45,
//                         minRotation: 45,
//                       },
//                     },
//                     y: {
//                       title: { display: true, text: "Price (€ / kWh)" },
//                       beginAtZero: true,
//                     },
//                   },
//                 }}
//               />
//             ) : (
//               <p>No data available for the selected time period.</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default EnergyPrices;

  