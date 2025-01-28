import React from "react";
import { Line } from "react-chartjs-2";

const PanelOutputChart = ({ data, options }) => {
    // get the solar output from simulation data
    
    return (
        <div className="line-chart-container">        
        <div className="line-chart">
            <Line data={data} options={options} />
        </div>
        </div>
    );
};

export default PanelOutputChart;
