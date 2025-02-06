import React, { useState, useEffect } from 'react';
import Card from './card';
import Chart from './energy_chart';
import './styles/solarDashboard.css';
import { SimulationData } from '../simulation_dashboard/SimulationData';
import { calculateResults } from '../simulation_dashboard/simulationUtils';  
import DailyRevenueCard from './DailyRevenueCalculator';
import WeeklyConsumptionCard from './WeeklyConsumptionCard';
import EnergyProductionCard from './EnergyProductionCard';
import PerformanceMonitoring from './PerformanceMonitoring'; 

function SolarDashboard() {
    const [isPanelSectionOpen, setIsPanelSectionOpen] = useState(false);
    const { results, sunshineData, loading, error } = SimulationData(); 

    if (loading) return <p>Loading simulation data...</p>;
    if (error) return <p>Error fetching data: {error}</p>;

    const togglePanelSection = () => {
        setIsPanelSectionOpen(!isPanelSectionOpen);
    };

    const panelData = [
        { id: 'Panel 1', production: 180, average: 200 },
        { id: 'Panel 2', production: 210, average: 200 },
        { id: 'Panel 3', production: 190, average: 200 },
    ];

    const getStatus = (production, average) => production >= average ? 'Normal' : 'Underperforming';
    const getStatusColor = (status) => status === 'Normal' ? 'green' : 'red';

    const estimatedSavings = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [6, 12, 10, 9],
        label: 'Savings (€)',
    };

    const calculateTotal = (data) => data.reduce((sum, value) => sum + value, 0);
    // Calculate the displayResults using the simulation logic
    const displayResults = results && sunshineData 
        ? calculateResults(results, sunshineData, [], [])  // Pass dummy arrays for prices and usage if needed
        : null;

    const totalEnergyProduced = parseFloat(displayResults?.fifteenDay.panelOutput || 0).toFixed(2);
    const batteryCapacity = parseFloat(results?.battery_capacity || 0).toFixed(2);
    const totalYield = parseFloat(displayResults?.fifteenDay.totalYield || 0).toFixed(2);

    console.log('Total Energy Usage:', displayResults?.fifteenDay.totalEnergyUsage);


    
    return (
        <div className="solar-dashboard">
            <div className="card-container">
                <DailyRevenueCard results={results} sunshineData={sunshineData} />
                <WeeklyConsumptionCard results={results} />
                <Card 
                    title="Estimated Savings" 
                    value={`€ ${calculateTotal(estimatedSavings.data).toFixed(2)}`} 
                    chartData={estimatedSavings} 
                    chartColor="rgba(255, 159, 64, 1)" // orange
                />
            </div>

            <div className="second-row">
                <div className="energy-production">
                    <EnergyProductionCard displayResults={displayResults} />
                </div>

                <PerformanceMonitoring 
                    totalEnergyProduced={totalEnergyProduced}
                    results={results}
                    batteryCapacity={batteryCapacity}
                    totalYield={totalYield}
                    displayResults={displayResults}
                />
            </div>

            <div className="panel-status-section">
                <h2 onClick={togglePanelSection} style={{ cursor: 'pointer', color: '#1b3b73' }}>
                    Panel Performance Monitoring {isPanelSectionOpen ? '▲' : '▼'}
                </h2>
                {isPanelSectionOpen && (
                    <div className="panel-status-list">
                        {panelData.map(panel => {
                            const status = getStatus(panel.production, panel.average);
                            const color = getStatusColor(status);
                            return (
                                <div 
                                    key={panel.id} 
                                    className="panel-status" 
                                    style={{ borderColor: color }}
                                >
                                    <h3>{panel.id}</h3>
                                    <p style={{ color: color }}>Status: {status}</p>
                                    <p>Production: {panel.production} kWh</p>
                                    <p>Average: {panel.average} kWh</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SolarDashboard;
