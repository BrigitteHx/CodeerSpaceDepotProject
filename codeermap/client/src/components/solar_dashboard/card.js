import React from "react";
import RealTimeClock from './realTimeClock';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Card({ title, value, chartData }) {
  return (
    <div className="card">
      <div className='card-information'>
        <h3>{title}</h3>
        <h2>{value}</h2>
        <h4><RealTimeClock /></h4>
      </div>

      <div className='card-graph'>
        {chartData && (
          <div className="chart-container" style={{ width: '100%', height: '150px' }}>
            <Bar
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: chartData.label,
                    data: chartData.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    display: false, // Hides the x-axis
                  },
                  y: {
                    display: false, // Hides the y-axis
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
