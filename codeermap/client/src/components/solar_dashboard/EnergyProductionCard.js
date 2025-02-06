import React from 'react';
import Chart from './energy_chart';  // Use the existing energy chart component

const EnergyProductionCard = ({ displayResults }) => {
    if (!displayResults) {
        return <p>No energy production data available.</p>;
    }

    const totalProduction = parseFloat(displayResults.fifteenDay.panelOutput) || 0;
    const dailyProduction = displayResults.daily.solarOutput || [];

    const productionChartData = {
        labels: Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`),
        data: dailyProduction.slice(0, 15),
        label: 'Daily Production (kWh)',
    };

    return (
        <div style={{ padding: '1px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            {/* <h3>Energy Production (15 Days)</h3>
            <p><strong>Total Production:</strong> {totalProduction.toFixed(2)} kWh</p> */}
            <div className='canvas' style={{ height: '100%' }}>  {/* Set proper height */}
                <Chart chartData={productionChartData} title="Daily Energy Production (15 Days)" />
            </div>
        </div>
    );
};

export default EnergyProductionCard;
