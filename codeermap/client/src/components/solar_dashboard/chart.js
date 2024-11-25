import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = [
  { month: 'Jan', value: 200 },
  { month: 'Feb', value: 300 },
  { month: 'Mar', value: 600 },
  { month: 'Apr', value: 500 },
  { month: 'May', value: 600 },
  { month: 'Jun', value: 800 },
  { month: 'Jul', value: 850 },
  { month: 'Aug', value: 750 },
  { month: 'Sep', value: 600 },
  { month: 'Oct', value: 400 },
  { month: 'Nov', value: 200 },
  { month: 'Dec', value: 200 },
  
];

function Chart({ title }) {
  // Prepare the chart data
  const chartData = {
    labels: data.map(d => d.month),  // X-axis labels (months)
    datasets: [
      {
        label: 'kWh',
        data: data.map(d => d.value), // Y-axis data (values)
        backgroundColor: 'rgba(75, 192, 192, 0.6)',  // Bar color
        borderColor: 'rgba(75, 192, 192, 1)',  // Bar border color
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    indexAxis: 'x',  // This makes the bars horizontal and places the months on the X-axis
    responsive: true,  // Chart resizes with the window
    scales: {
      x: {
        beginAtZero: true,  // Ensure x-axis starts at 0
        title: {
          display: true,
          text: 'kWh',  // Title for x-axis (representing the value)
        },
      },
      y: {
        beginAtZero: true,  // Ensure y-axis starts at 0
        title: {
          display: true,
          text: 'Month',  // Title for y-axis (representing the months)
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: title,  // Display title of the chart
      },
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="chart-container" style={{ width: '80%', height: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default Chart;
