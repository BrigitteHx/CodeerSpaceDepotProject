import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgress = ({ panelOutput, energyUsage }) => {
  // Calculate percentage and surplus/deficit
  const percentage = (panelOutput / energyUsage) * 100;
  const isSurplus = panelOutput >= energyUsage;
  
  // Color scheme based on surplus/deficit
  const color = isSurplus ? '#2ecc71' : '#FF6347'; // Green for surplus, red for deficit
  const barColor = isSurplus ? '#4CAF50' : '#FF5733'; // Darker color for progress bar contrast

  // Calculate the difference in energy
  const difference = Math.abs(panelOutput - energyUsage);
  const differenceMessage = isSurplus
    ? `You're producing ${difference.toFixed(2)} kWh more than your daily usage!`
    : `You're lacking ${difference.toFixed(2)} kWh to meet your daily usage.`;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Daily Energy Usage vs Solar Panel Output</h3>

      {/* Explanation Section */}
      <div style={styles.explanation}>
        <p style={{ ...styles.differenceMessage, color: color }}>
          {differenceMessage}
        </p>
      </div>

      {/* Data Display Section */}
      <div style={styles.dataDisplay}>
        <p style={styles.dataItem}>
          <span style={styles.panelOutput}>Panel Output:</span>
          <span style={styles.value}>{panelOutput} kWh</span>
        </p>
        <p style={styles.dataItem}>
          <span style={styles.energyUsage}>Energy Usage:</span>
          <span style={styles.value}>{energyUsage} kWh</span>
        </p>
      </div>

      {/* Circular Progress Bar */}
      <div style={styles.progressBarContainer}>
        <div style={styles.progressBarWrapper}>
          <CircularProgressbar
            value={percentage}
            maxValue={100}
            text={`${percentage.toFixed(2)}%`}
            styles={buildStyles({
              textColor: color,
              pathColor: barColor,
              trailColor: '#e0e0e0',
              strokeWidth: 12,
              textSize: 'clamp(14px, 2vw, 20px)',
              pathTransitionDuration: 1.8,
            })}
          />
        </div>
      </div>
    </div>
  );
};

// Styling object
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '90vw',
    margin: '0 auto',
  },
  title: {
    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
    color: '#34495e',
    marginBottom: '15px',
  },
  explanation: {
    marginTop: '15px',
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#34495e',
  },
  differenceMessage: {
    fontWeight: 'bold',
  },
  dataDisplay: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dataItem: {
    fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
    fontWeight: 'bold',
    color: '#34495e',
  },
  panelOutput: {
    color: '#4CAF50',
  },
  energyUsage: {
    color: '#FF5722',
  },
  value: {
    color: '#34495e',
  },
  progressBarContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  progressBarWrapper: {
    width: 'min(90vw, 400px)',
    height: 'min(90vw, 400px)',
  },
};

export default CircularProgress;
