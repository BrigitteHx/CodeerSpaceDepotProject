import React from 'react';
import Card from './card';
import Chart from './chart';
import "./styles/solarDashboard.css"; 

function SolarDashboard() {
    console.log("SolarDashboard component rendered");
  return (
    <div className="solar-dashboard">
        <div className="card-container">
            <Card title="Daily Revenue" value="14.450" />
            <Card title="Consumption" value="14.450 kWh" />
            <Card title="Estimated Savings" value="€ 14.450" />
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
