export const calculateChargingTime = ({ solarOutput, homeUsage, batteryCapacity, currentChargeLevel }) => {
    const excessEnergy = solarOutput - homeUsage;
  
    if (excessEnergy <= 0) {
      return "Not charging (Insufficient solar production)";
    }
  
    const energyNeededToCharge = batteryCapacity - currentChargeLevel;
    const chargingTime = energyNeededToCharge / excessEnergy; // Time in hours
  
    return `${chargingTime.toFixed(2)} hours to fully charge`;
  };
  