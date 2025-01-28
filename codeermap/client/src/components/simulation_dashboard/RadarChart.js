import React from 'react';
import { Radar } from 'react-chartjs-2';

const RadarChart = ({ data }) => {
  return (
    <div style={{ width: '600px', height: '600px', margin: '0 auto' }}>
      <h3>Performance Overview</h3>
      <p>
        This radar chart provides an overview of your energy system’s performance. It compares 
        three key factors: your total energy consumption, solar panel output, and total savings.
      </p>
      <Radar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default RadarChart;
