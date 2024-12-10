import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SunshineHours from './SunHours';
import EnergyPrices from './EnergyPrices';
import './style/SimulatieDashboard.css';

const SimulatieDashboard = () => {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [solarPanelOutput, setSolarPanelOutput] = useState(0);
  const [batteryChargeTime, setBatteryChargeTime] = useState(0);

  // User input states for calculations
  const [formData, setFormData] = useState({
    residents: 1,
    houseSize: 50,
    insulationLevel: 'low',
    appliancesUsage: 5, // average appliance usage in kWh per day
    daysAtHome: 30,
    panels: 10,
    panelArea: 20,
    panelPower: 200, // watts per m²
    location: 'city',
    batteryCapacity: 10,
    chargeRate: 5, // kW
    batteryEfficiency: 90,
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate Energy Usage
  const calculateEnergyUsage = () => {
    const { residents, appliancesUsage, daysAtHome } = formData;
    const energyUsage = residents * appliancesUsage * daysAtHome;
    setEnergyUsage(energyUsage);
  };

  // Calculate Solar Panel Output
  const calculateSolarPanelOutput = () => {
    const { panelArea, panelPower, location } = formData;
    const sunHours = location === 'city' ? 4 : 5; // Example sun hours
    const output = (panelArea * panelPower * sunHours) / 1000; // kWh
    setSolarPanelOutput(output);
  };

  // Calculate Battery Charge Time
  const calculateBatteryChargeTime = () => {
    const { batteryCapacity, chargeRate, batteryEfficiency } = formData;
    const chargeTime = (batteryCapacity / chargeRate) * (100 / batteryEfficiency);
    setBatteryChargeTime(chargeTime);
  };

  useEffect(() => {
    // Call calculation functions when the form data changes
    calculateEnergyUsage();
    calculateSolarPanelOutput();
    calculateBatteryChargeTime();
  }, [formData]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Energy Prices and Sunshine Hours Section */}
      <div className="energy-section">
        <div className="energy-prices">
          <EnergyPrices />
        </div>
      </div>

      <div className="energy-section">
        <div className="sunshine-hours">
            <SunshineHours />
        </div>
      </div>
      
      {/* Simulatie Form and Results Section */}
      <div className="forms-and-results">
        <div className="forms-container">
          {/* Household Energy Usage Form */}
          <div className="section">
            <h2>Calculate Household Energy Usage</h2>
            <form>
              <label>Aantal bewoners</label>
              <input
                type="number"
                name="residents"
                value={formData.residents}
                onChange={handleChange}
                required
              />
              <label>Grootte woning (m²)</label>
              <input
                type="number"
                name="houseSize"
                value={formData.houseSize}
                onChange={handleChange}
                required
              />
              <label>Isolatieniveau</label>
              <select
                name="insulationLevel"
                value={formData.insulationLevel}
                onChange={handleChange}
                required
              >
                <option value="low">Laag</option>
                <option value="medium">Middel</option>
                <option value="high">Hoog</option>
              </select>
              <label>Veelgebruikte apparaten (kWh/dag)</label>
              <input
                type="number"
                name="appliancesUsage"
                value={formData.appliancesUsage}
                onChange={handleChange}
                required
              />
              <label>Tijd thuis per dag (dagen)</label>
              <input
                type="number"
                name="daysAtHome"
                value={formData.daysAtHome}
                onChange={handleChange}
                required
              />
            </form>
            <div className="result-block">
              <h3>Calculated Energy Usage: {energyUsage} kWh</h3>
              <p>
                This calculation estimates your household's total energy consumption based on the number of
                residents, daily appliance usage, and the number of days spent at home.
              </p>
            </div>
          </div>

          {/* Solar Panel Configuration Form */}
          <div className="section">
            <h2>Calculate Solar Panel Output</h2>
            <form>
              <label>Aantal zonnepanelen</label>
              <input
                type="number"
                name="panels"
                value={formData.panels}
                onChange={handleChange}
                required
              />
              <label>Oppervlakte (m²)</label>
              <input
                type="number"
                name="panelArea"
                value={formData.panelArea}
                onChange={handleChange}
                required
              />
              <label>Vermogen per m² (W)</label>
              <input
                type="number"
                name="panelPower"
                value={formData.panelPower}
                onChange={handleChange}
                required
              />
              <label>Locatie</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="city">City</option>
                <option value="rural">Rural</option>
              </select>
            </form>
            <div className="result-block">
              <h3>Calculated Solar Panel Output: {solarPanelOutput} kWh</h3>
              <p>
                This calculation estimates how much energy your solar panels will generate based on the
                panel area, panel efficiency, and location.
              </p>
            </div>
          </div>

          {/* Battery Configuration Form */}
          <div className="section">
            <h2>Calculate Battery Charging Time</h2>
            <form>
              <label>Batterijcapaciteit (kWh)</label>
              <input
                type="number"
                name="batteryCapacity"
                value={formData.batteryCapacity}
                onChange={handleChange}
                required
              />
              <label>Oplaadsnelheid (kW)</label>
              <input
                type="number"
                name="chargeRate"
                value={formData.chargeRate}
                onChange={handleChange}
                required
              />
              <label>Efficiëntie van de batterij (%)</label>
              <input
                type="number"
                name="batteryEfficiency"
                value={formData.batteryEfficiency}
                onChange={handleChange}
                required
              />
            </form>
            <div className="result-block">
              <h3>Calculated Battery Charge Time: {batteryChargeTime} hours</h3>
              <p>
                This calculation estimates how long it will take to fully charge your battery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatieDashboard;
