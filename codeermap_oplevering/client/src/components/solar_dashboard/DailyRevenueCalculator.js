import React from 'react';
import Card from './card';

// Function to convert sunshine data, calculate solar output, and savings
const calculateDailyRevenue = (results, sunshineData) => {
    if (!results || !sunshineData) return { dailySavingsList: [], totalRevenue: 0 };

    // Step 1: Convert sunshine data from seconds to hours and limit to 7 days
    const sunshineHoursInHours = sunshineData.slice(0, 7).map(duration => duration / 3600);
    console.log('Converted Sunshine Hours (hours) for 7 days:', sunshineHoursInHours);

    // Step 2: Calculate solar output
    const panelEfficiencyFactor = results.panel_efficiency / 100;
    const panelPowerKw = results.panel_power / 1000;
    const panels = results.panels;

    const solarDailyOutput = sunshineHoursInHours.map(hours => {
        const dailyOutput = panels * panelPowerKw * hours * panelEfficiencyFactor;
        return parseFloat(dailyOutput.toFixed(2));
    });

    console.log('Calculated Solar Daily Output (kWh) for 7 days:', solarDailyOutput);

    // Step 3: Calculate daily savings for 7 days
    const hourlyUsage = Array(24).fill(0.2);  // Example usage per hour
    const dynamicPrices = Array(24).fill(0.20);  // Example dynamic prices per kWh

    let totalSavings = 0;
    const dailySavingsList = solarDailyOutput.map((output) => {
        let dailySaving = 0;
        for (let hour = 0; hour < 24; hour++) {
            const hourUsage = hourlyUsage[hour];
            const hourPrice = dynamicPrices[hour];
            const hourSolar = output / 24;

            if (hourSolar >= hourUsage) {
                dailySaving += hourUsage * hourPrice;
            } else {
                dailySaving += hourSolar * hourPrice;
            }
        }
        totalSavings += dailySaving;
        return { savings: dailySaving.toFixed(2) };
    });

    return {
        dailySavingsList,
        totalRevenue: totalSavings.toFixed(2),
    };
};

const DailyRevenueCard = ({ results, sunshineData }) => {
    const { dailySavingsList, totalRevenue } = calculateDailyRevenue(results, sunshineData);

    const dailyRevenueChartData = {
        labels: Array.from({ length: dailySavingsList.length }, (_, i) => `Day ${i + 1}`),
        data: dailySavingsList.map(day => parseFloat(day.savings)),
        label: 'Daily Revenue (€)',
    };

    return (
        <Card 
            title="Daily Revenue" 
            value={`€ ${totalRevenue}`} 
            chartData={dailyRevenueChartData} 
            chartColor="rgba(50, 205, 50, 1)" 
        />
    );
};

export default DailyRevenueCard;
