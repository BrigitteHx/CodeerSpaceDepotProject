// Functions to be used in simulationController.js
const db = require('../config/db');
const axios = require('axios');

// Route to save simulation data
exports.saveSimulation = (req, res) => {
    const {
        user_id,
        residents,
        panels,
        panel_power,
        panel_efficiency,
        battery_capacity,
        charge_rate,
        battery_efficiency,
        energy_usage_method,
        custom_kwh_usage,
        pricing_option
      } = req.body;
  
      const checkQuery = "SELECT id FROM simulations WHERE user_id = ?";
  
      db.query(checkQuery, [user_id], (err, result) => {
          if (err) {
              console.error("Error checking simulation:", err);
              return res.status(500).json({ error: "Database error while checking simulation." });
          }
  
          if (result.length > 0) {              const updateQuery = `
                  UPDATE simulations 
                  SET residents = ?, panels = ?, panel_power = ?, panel_efficiency = ?, 
                      battery_capacity = ?, charge_rate = ?, battery_efficiency = ?, 
                      energy_usage_method = ?, custom_kwh_usage = ?, pricing_option = ?
                  WHERE user_id = ?
              `;
  
              const updateValues = [
                  residents, panels, panel_power, panel_efficiency, battery_capacity,
                  charge_rate, battery_efficiency, energy_usage_method, custom_kwh_usage,
                  pricing_option, user_id
              ];
  
              db.query(updateQuery, updateValues, (err, result) => {
                  if (err) {
                      console.error("Error updating simulation:", err);
                      return res.status(500).json({ error: "Error updating simulation data." });
                  }
                  return res.status(200).json({ message: "Simulation data updated successfully!" });
              });
  
          } else {
              const insertQuery = `
                  INSERT INTO simulations 
                  (user_id, residents, panels, panel_power, panel_efficiency, battery_capacity, 
                   charge_rate, battery_efficiency, energy_usage_method, custom_kwh_usage, pricing_option)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;
  
              const insertValues = [
                  user_id, residents, panels, panel_power, panel_efficiency, battery_capacity,
                  charge_rate, battery_efficiency, energy_usage_method, custom_kwh_usage,
                  pricing_option
              ];
  
              db.query(insertQuery, insertValues, (err, result) => {
                  if (err) {
                      console.error("Error inserting simulation:", err);
                      return res.status(500).json({ error: "Error saving simulation data." });
                  }
                  return res.status(200).json({ message: "Simulation data saved successfully!", simulationId: result.insertId });
              });
          }
      });
  };

// Fetch simulation data by userId
exports.getSimulationDataByUserId = (req, res) => {
    const userId = req.userId;
    const query = 'SELECT * FROM simulations WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching simulation data:', err);
            return res.status(500).send('Error retrieving simulation data');
        }
        res.status(200).json(results);
    });
};
