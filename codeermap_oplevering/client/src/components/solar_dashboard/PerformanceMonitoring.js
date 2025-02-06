import React from 'react';
import './styles/solarDashboard.css'; 

const calculateHouseholdUsage = (results) => {
    if (!results) return 0;

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
            dailyUsagePerResident = results.custom_kwh_usage / (2 * 15);
            break;
        default:
            dailyUsagePerResident = 5;
    }

    const dailyConsumption = Array(15).fill(results.residents * dailyUsagePerResident);
    const totalHouseholdUsage = dailyConsumption.reduce((sum, value) => sum + value, 0);

    return {
        totalHouseholdUsage: totalHouseholdUsage.toFixed(2),
        hourlyUsage: (totalHouseholdUsage / (15 * 24)).toFixed(2),  // 1-hour usage
    };
};

const calculateMinMaxProduction = (solarOutput) => {
    if (!solarOutput || solarOutput.length === 0) return { min: 0, max: 0 };

    const min = Math.min(...solarOutput).toFixed(2);
    const max = Math.max(...solarOutput).toFixed(2);
    return { min, max };
};

const calculateTotalYield = (solarOutput) => {
    if (!solarOutput || solarOutput.length === 0) return 0;

    // Sum all daily production values for 15 days
    return solarOutput.reduce((sum, output) => sum + parseFloat(output || 0), 0).toFixed(2);
};

const PerformanceMonitoring = ({ totalEnergyProduced, results, batteryCapacity, displayResults }) => {
    const { totalHouseholdUsage, hourlyUsage } = calculateHouseholdUsage(results);
    const { min, max } = calculateMinMaxProduction(displayResults?.daily?.solarOutput || []);

    const currentCapacity = (batteryCapacity * 0.75).toFixed(2);  // Hardcoded at 75% full
    const totalYield = calculateTotalYield(displayResults?.daily?.solarOutput || []);

    return (
        <div className="performance-monitoring">
            <h2>Performance Monitoring</h2>
            <div className='charging-usage'>
                <div className='charging'>
                    <h3>Total Energy Produced</h3>
                    <h1>{totalEnergyProduced} kWh</h1>
                    <p>Min. {min} kWh Max. {max} kWh</p>
                </div>
                <div className='usage'>
                    <h3>Household Usage</h3>
                    <h1>{totalHouseholdUsage} kWh</h1>
                    <p>1 Hour Usage: {hourlyUsage} kWh</p>
                </div>
            </div>
            <div className='capacity-yield'>
                <div className='capacity'>
                    <h3>Capacity</h3>
                    <h4>{currentCapacity} kWh / {batteryCapacity} kWh</h4>
                </div>
                <div className='yield'>
                    <h3>Total Yield</h3>
                    <h4>{totalYield} kWh</h4>
                </div>
            </div>
        </div>
    );
};

export default PerformanceMonitoring;
