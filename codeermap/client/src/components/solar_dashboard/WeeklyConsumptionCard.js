import React from 'react';
import Card from './card';

// Function to calculate weekly consumption dynamically
const calculateWeeklyConsumption = (results) => {
    if (!results) return { weeklyConsumptionData: [], totalConsumption: 0 };

    // Step 1: Determine the daily usage per resident based on energy usage method
    let dailyUsagePerResident;
    switch (results.energy_usage_method) {
        case 'low':
            dailyUsagePerResident = 3;
            break;
        case 'medium':
            dailyUsagePerResident = 5;
            break;
        case 'high':
            dailyUsagePerResident = 8;
            break;
        case 'actual':
            dailyUsagePerResident = results.custom_kwh_usage / (2 * 15);  // Spread over 15 days
            break;
        default:
            dailyUsagePerResident = 5;  // Default to medium
    }

    // Step 2: Calculate total daily consumption for 28 days
    const dailyConsumptionData = Array(28).fill(results.residents * dailyUsagePerResident);

    // Step 3: Group daily consumption into 4 weeks
    const weeks = [0, 0, 0, 0];
    dailyConsumptionData.forEach((value, index) => {
        const weekIndex = Math.floor(index / 7);  // Group by week
        weeks[weekIndex] += value;
    });

    // Step 4: Calculate total consumption
    const totalConsumption = weeks.reduce((sum, value) => sum + value, 0);

    return {
        weeklyConsumptionData: weeks,
        totalConsumption,
    };
};

const WeeklyConsumptionCard = ({ results }) => {
    const { weeklyConsumptionData, totalConsumption } = calculateWeeklyConsumption(results);

    const consumptionChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: weeklyConsumptionData,
        label: 'Consumption (kWh)',
    };

    return (
        <Card 
            title="Weekly Consumption" 
            value={`${totalConsumption.toFixed(2)} kWh`} 
            chartData={consumptionChartData} 
            chartColor="rgba(225, 50, 50, 1)"  // Red for consumption
        />
    );
};

export default WeeklyConsumptionCard;
    