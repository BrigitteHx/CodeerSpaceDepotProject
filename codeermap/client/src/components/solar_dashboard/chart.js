import React from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = ({ chartData, title }) => {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: chartData.label,
                data: chartData.data,
                backgroundColor: 'rgba(255, 223, 82, 1)',  // Yellow bars
                borderColor: 'rgba(255, 193, 7, 1)',  // Darker yellow for borders
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Energy Production (kWh)',
                },
            },
        },
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default Chart;
