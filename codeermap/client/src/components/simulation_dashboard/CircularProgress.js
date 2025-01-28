import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgress = ({ panelOutput, energyUsage }) => {
  const percentage = (panelOutput / energyUsage) * 100;
  const isSurplus = panelOutput >= energyUsage;
  const color = isSurplus ? '#2ecc71' : '#FF6347'; // Green for surplus, red for deficit
  const barColor = isSurplus ? '#4CAF50' : '#FF5733'; // Darker color for contrast

  // Calculate the difference
  const difference = Math.abs(panelOutput - energyUsage);
  const differenceMessage = isSurplus
    ? `You're producing ${difference.toFixed(2)} kWh more than your daily usage!`
    : `You're lacking ${difference.toFixed(2)} kWh to meet your daily usage.`;

  return (
    <div style={{ textAlign: 'center', padding: '30px' }}>
      <h3 style={{ fontSize: '1.7rem', color: '#34495e', marginBottom: '20px' }}>Daily Energy Usage vs Solar Panel Output</h3>
      
      {/* Explanation Section */}
      <div style={{ marginTop: '20px', fontSize: '1.2rem', color: '#34495e' }}>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: color }}>
          {differenceMessage}
        </p>
      </div>
      
      {/* Data Display Section */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#34495e' }}>
            <span style={{ color: '#4CAF50' }}>Panel Output: </span>
            <span style={{ fontSize: '1.4rem', color: '#34495e' }}>{panelOutput} kWh</span>
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34495e' }}>
            <span style={{ color: '#FF5722' }}>Energy Usage: </span>
            <span style={{ fontSize: '1.5rem', color: '#34495e' }}>{energyUsage} kWh</span>
          </p>
        </div>
      </div>

      {/* Circular Progress Bar */}
      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>
          <CircularProgressbar
            value={percentage}
            maxValue={100}
            text={`${percentage.toFixed(2)}%`}
            styles={buildStyles({
              textColor: color,
              pathColor: barColor,
              trailColor: '#e0e0e0',
              strokeWidth: 12,
              textSize: '20px',
              pathTransitionDuration: 1.8, // Smooth transition
            })}
          />
        </div>
      </div>

    </div>
  );
};

export default CircularProgress;
