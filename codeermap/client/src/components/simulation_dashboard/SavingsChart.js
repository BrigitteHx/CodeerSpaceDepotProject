import React from "react";
import { Bar } from "react-chartjs-2";

const SavingsChart = ({ displayResults, dateLabels }) => {
  if (!displayResults) return null;

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: "Savings (€)",
        data: displayResults.daily.savingsList.map(day => day.savings),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)", 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return typeof value === "number"
              ? `${context.dataset.label}: €${value.toFixed(2)}`
              : `${context.dataset.label}: N/A`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, 
        title: {
          display: true,
          text: "Savings (€)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default SavingsChart;
