import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import "./style/SimulationForm.css";

const SimulationForm = () => {
  const { userData } = useAuth();
  const userId = userData?.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    residents: "",
    energyUsageMethod: "medium",
    customKwhUsage: "",
    panels: "",
    panelPower: "",
    panelEfficiency: "",
    batteryCapacity: "",
    chargeRate: "",
    batteryEfficiency: "",
    pricingOption: "dynamic",
    pricingPreset: "average",
  });

  const [loading, setLoading] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Current step state

  // Validation for each step
  const validateInput = () => {
    const { residents, energyUsageMethod, customKwhUsage, panels, panelPower, panelEfficiency, batteryCapacity, chargeRate, batteryEfficiency, pricingOption, pricingPreset } = formData;
    
    // Validation based on current step
    if (currentStep === 1) {
      // Step 1: Energy Usage Form
      if (!residents || residents < 1) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid number of residents.",
        });
        return false;
      }
  
      if (energyUsageMethod === "custom" && (!customKwhUsage || customKwhUsage < 0)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid custom kWh usage.",
        });
        return false;
      }
    } else if (currentStep === 2) {
      // Step 2: Solar Panels Form
      if (!panels || panels < 1) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid number of panels.",
        });
        return false;
      }
  
      if (!panelPower || panelPower < 1) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid panel power.",
        });
        return false;
      }
  
      if (!panelEfficiency || panelEfficiency < 1 || panelEfficiency > 100) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid panel efficiency.",
        });
        return false;
      }
    } else if (currentStep === 3) {
      // Step 3: Battery Form
      if (!batteryCapacity || batteryCapacity < 1) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid battery capacity.",
        });
        return false;
      }
  
      if (!chargeRate || chargeRate < 1) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid charge rate.",
        });
        return false;
      }
  
      if (!batteryEfficiency || batteryEfficiency < 0 || batteryEfficiency > 100) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid battery efficiency.",
        });
        return false;
      }
    } else if (currentStep === 4) {
      // Step 4: Pricing Option Form
      if (!pricingOption) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please select a pricing option.",
        });
        return false;
      }
  
      if (pricingOption === "preset" && !pricingPreset) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please select a preset consumption level.",
        });
        return false;
      }
    }
  
    return true;
  };
  
  // Handle form data change
const handleChange = (event) => {
  const { name, value } = event.target;

  // Check if the event.target is the select element
  if (event.target.tagName === "SELECT") {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Use value from the select element
    }));
  } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Handle other form elements
    }));
  }
};


  // Handle next step
  const handleNextStep = () => {
    if (validateInput()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }

    const result = await Swal.fire({
      title: "Save",
      text: "Do you want to save your data in the database?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save!",
      cancelButtonText: "No, don't save",
    });

    const saveData = result.isConfirmed;
    if (saveData) {
      setLoading(true);

      try {
        const simulationData = {
          user_id: userId,
          residents: formData.residents,
          panels: formData.panels,
          panel_area: formData.panelArea,
          panel_power: formData.panelPower,
          panel_efficiency: formData.panelEfficiency,
          battery_capacity: formData.batteryCapacity,
          charge_rate: formData.chargeRate,
          battery_efficiency: formData.batteryEfficiency,
          energy_usage_method: formData.energyUsageMethod,
          custom_kwh_usage: formData.customKwhUsage || null,
          pricing_option: formData.pricingPreset,
        };

        await axios.post(
          "http://localhost:5000/api/simulation",
          { ...simulationData, user_id: userId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        localStorage.setItem("simulationResults", JSON.stringify(simulationResults));

        Swal.fire({
          icon: "success",
          title: "Simulation Saved",
          text: "Your simulation data has been successfully saved!",
        });

        setSimulationResults(simulationResults);
        navigate(`/SimulationDashboard`);
      } catch (error) {
        console.error("Error saving simulation:", error);
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "There was an issue saving your simulation. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Not Saved",
        text: "Your simulation data was not saved.",
      });
    }
    navigate(`/SimulationDashboard`);
    setLoading(false);
  };

  // Step 1: Energy Usage Form
  const step1 = (
    <div className="form-section">
      <h3>Energy Usage</h3>
      <label>
        <span className="label-text">
          Number of Residents
          <span className="tooltip">?
            <span className="tooltip-text">
              The number of people in your household affects the average energy consumption.
            </span>
          </span>
        </span>
        <input
          type="number"
          name="residents"
          min="1"
          value={formData.residents}
          onChange={handleChange}
        />
      </label>

      <label>
        <span className="label-text">
          Energy Usage Method
          <span className="tooltip">?
            <span className="tooltip-text">
              Choose your average appliance usage level or provide specific energy usage in kWh.
            </span>
          </span>
        </span>
        <select
          name="energyUsageMethod"
          value={formData.energyUsageMethod}
          onChange={handleChange}
        >
          <option value="high">High Usage</option>
          <option value="medium">Medium Usage</option>
          <option value="low">Low Usage</option>
          <option value="custom">Specify kWh Usage</option>
        </select>
      </label>

      {formData.energyUsageMethod === "custom" && (
        <label>
          <span className="label-text">
            Enter kWh Usage
            <span className="tooltip">?
              <span className="tooltip-text">
                Provide the total energy usage in kilowatt-hours (kWh) per month.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="customKwhUsage"
            min="0"
            value={formData.customKwhUsage}
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );

  // Step 2: Solar Panels Form
  const step2 = (
    <div className="form-section">
      <h3>Solar Panels</h3>
      <label>
        <span className="label-text">
          Number of Solar Panels
          <span className="tooltip">?
            <span className="tooltip-text">
              Enter the number of solar panels you have installed.
            </span>
          </span>
        </span>
        <input
          type="number"
          name="panels"
          min="1"
          value={formData.panels}
          onChange={handleChange}
        />
      </label>

      <label>
        <span className="label-text">
          Panel Power (W)
          <span className="tooltip">?
            <span className="tooltip-text">
              Enter the power rating of each solar panel in watts.
            </span>
          </span>
        </span>
        <input
          type="number"
          name="panelPower"
          min="1"
          value={formData.panelPower}
          onChange={handleChange}
        />
      </label>

      <label>
        <span className="label-text">
          Panel Efficiency (%)
          <span className="tooltip">?
            <span className="tooltip-text">
              Enter the efficiency of your solar panels (usually between 15% and 22%).
            </span>
          </span>
        </span>
        <input
          type="number"
          name="panelEfficiency"
          min="1"
          max="100"
          value={formData.panelEfficiency}
          onChange={handleChange}
        />
      </label>
    </div>
  );

  // Step 3: Battery Form
  const step3 = (
    <div className="form-section">
      <h3>Battery</h3>
      <label>
        <span className="label-text">
          Battery Capacity (kWh)
          <span className="tooltip">?
            <span className="tooltip-text">
              Enter the battery storage capacity in kilowatt-hours.
            </span>
          </span>
        </span>
        <input
          type="number"
          name="batteryCapacity"
          min="0"
          value={formData.batteryCapacity}
          onChange={handleChange}
        />
      </label>
      <label>
        <span className="label-text">
          Charge Rate (kW)
          <span className="tooltip">?
            <span className="tooltip-text">
              Specify how fast your battery charges, in kilowatts.
            </span>
          </span>
        </span>
        <input
          type="number"
          name="chargeRate"
          min="0"
          value={formData.chargeRate}
          onChange={handleChange}
        />
      </label>
      <label>
        <span className="label-text">
          Efficiency (%)
          <span className="tooltip">?
            <span className="tooltip-text">
              Enter the efficiency of your battery system as a percentage.
            </span>
          </span>
        </span>
        <input
          type="number"
          name="batteryEfficiency"
          min="0"
          max="100"
          value={formData.batteryEfficiency}
          onChange={handleChange}
        />
      </label>
    </div>
  );

  // Step 4: Pricing Option Form
  const step4 = (
    <div className="form-section">
      <h3> Energy Cost Calculator </h3>

      <label>
        <span className="label-text">
          Pricing Option
          <span className="tooltip">?
            <span className="tooltip-text">
              Choose between Dynamic Pricing or selecting a preset consumption level for your energy.
            </span>
          </span>
        </span>
        <select
          name="pricingOption"
          value={formData.pricingOption}
          onChange={(e) => handleChange(e)}  // Ensure to pass event here
        >
          <option value="dynamic">Use Dynamic Pricing</option>
          <option value="preset">Choose a Preset</option>
        </select>
      </label>

      {/* Display Presets if 'preset' option is selected */}
      {formData.pricingOption === "preset" && (
        <div className="preset-select">
          <label>
            <span className="label-text">
              Select Consumption Level
              <span className="tooltip">?
                <span className="tooltip-text">
                  Choose a preset consumption level based on your household's average energy usage.
                  <ul>
                    <li><strong>Low:</strong> Minimal energy use (e.g., single occupant, energy-saving appliances).</li>
                    <li><strong>Average:</strong> Moderate energy use (e.g., small family, standard appliances).</li>
                    <li><strong>High:</strong> Higher energy use (e.g., larger households, frequent appliance use).</li>
                  </ul>
                </span>
              </span>
            </span>
            <select
              name="pricingPreset"
              value={formData.pricingPreset}
              onChange={(e) => handleChange(e)}  // Ensure to pass event here
            >
              <option value="low">Low Consumption</option>
              <option value="average">Average Consumption</option>
              <option value="high">High Consumption</option>
            </select>
          </label>
          {/* Add a description below the dropdown for clarity */}
          <div className="preset-description">
            {formData.pricingPreset === "low" && (
              <p>
                <strong>Low Consumption:</strong> Ideal for individuals or small households that use energy-efficient appliances and have low energy demands.
              </p>
            )}
            {formData.pricingPreset === "average" && (
              <p>
                <strong>Average Consumption:</strong> Suitable for small to medium-sized households with moderate energy usage.
              </p>
            )}
            {formData.pricingPreset === "high" && (
              <p>
                <strong>High Consumption:</strong> For larger households or high energy use with multiple appliances.
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );

  // Render steps based on the current step
  return (
    <form className="simulation-form" onSubmit={handleSubmit}>
      <h2>Simulation Form</h2>
      <p className="form-description">
        Fill in the fields below to create a simulation of your monthly energy usage and production.
      </p>

      {currentStep === 1 && step1}
      {currentStep === 2 && step2}
      {currentStep === 3 && step3}
      {currentStep === 4 && step4}

      {/* Buttons */}
      <div className="form-buttons">
        {currentStep > 1 && (
          <button className="prev-btn" type="button" onClick={handlePreviousStep}>
            Previous
          </button>
        )}
        {currentStep < 4 && (
          <button className="next-btn" type="button" onClick={handleNextStep}>
            Next
          </button>
        )}
        {currentStep === 4 && (
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Simulation"}
          </button>
        )}
      </div>
    </form>
  );
};

export default SimulationForm;
