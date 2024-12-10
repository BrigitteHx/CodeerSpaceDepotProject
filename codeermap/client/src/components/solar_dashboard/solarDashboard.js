import React from 'react';
import Card from './card';
import Chart from './energy_chart';
import "./styles/solarDashboard.css"; 

function SolarDashboard() {
    console.log("SolarDashboard component rendered");

    const dailyRevenueChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        data: [200, 300, 400, 500],
        label: 'Revenue (€)',
      };
    
      const consumptionChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [100, 120, 110, 130],
        label: 'Consumption (kWh)',
      };

      const estimatedSavings = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [10, 12, 11, 9],
        label: 'Savings (€)',
      };
      
return (
    <div className="solar-dashboard">
        <div className="card-container">
            <Card title="Daily Revenue" value="€ 14.450" chartData={dailyRevenueChartData} />
            <Card title="Consumption" value="14.450 kWh" chartData={consumptionChartData} />
            <Card title="Estimated Savings" value="€ 14.450" chartData={estimatedSavings} />
        </div>

        <div className='second-row'>
            <Chart title="Energy Production" />

            <div className="performance-monitoring">
                <h2>Performance Monitoring</h2>
                {/* <div className='divider'></div> */}
                <div className='charging-usage'>
                    <div className='charging'>
                        <h3>Total Charging</h3>
                        <h1>14.450 kWh</h1>
                        <p>Min. 3.0 Max. 10.0</p>
                    </div>
                    <div className='usage'>
                        <h3>Power Usage</h3>
                        <h1>14.450 kWh</h1>
                        <p>1 Hour Usage 6 kWh</p>
                    </div>
                </div>
                <div className='capacity-yield'>
                    <div className='capacity'>
                        <h3>Capacity</h3>
                        <h4>220 kWh</h4>
                    </div>
                    <div className='yield'>
                        <h3>Total yield</h3>
                        <h4>175 kWh</h4>
                    </div>
                </div>
            </div>            
        </div>

    </div>
);
}

export default SolarDashboard;
