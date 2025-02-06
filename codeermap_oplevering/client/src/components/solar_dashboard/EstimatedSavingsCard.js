import React from 'react';
import Card from './card';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { calculateResults } from '../simulatie_dashboard/simulationUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EstimatedSavingsCard = ({ results, sunshineData }) => {
    if (!results || !sunshineData) {
        console.warn('Missing results or sunshine data in EstimatedSavingsCard.');
        return null;
    }

    // Step 1: Calculate displayResults using imported utility
    const dynamicPrices = Array(24).fill(0.20);  // Example prices
    const defaultUsage = Array(24).fill(0.2);    // Example hourly usage
    const displayResults = calculateResults(results, sunshineData, dynamicPrices, defaultUsage);

    // Step 2: Extract savings and prepare chart data
    const totalSavings = parseFloat(displayResults.fifteenDay.savings) || 0;
    const savingsChartData = {
        labels: displayResults.daily.savingsList.map((_, i) => `Day ${i + 1}`),
        datasets: [
            {
                label: 'Daily Savings (€)',
                data: displayResults.daily.savingsList.map(day => parseFloat(day.savings)),
                backgroundColor: 'rgba(50, 205, 50, 0.6)',
                borderColor: 'rgba(50, 205, 50, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Step 3: Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Savings (€)',
                },
            },
        },
    };

    return (
        <Card title="Estimated Savings (15 Days)" value={`€ ${totalSavings.toFixed(2)}`} chartColor="rgba(50, 205, 50, 1)">
            <div style={{ height: '150px' }}>
                <Bar data={savingsChartData} options={options} />
            </div>
        </Card>
    );
};

export default EstimatedSavingsCard;