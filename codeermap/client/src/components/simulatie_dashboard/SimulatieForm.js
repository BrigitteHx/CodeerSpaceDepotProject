import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/Simulatie.css";

const SimulatieForm = () => {
  const navigate = useNavigate();
  const userId = 1; // Gebruik de juiste userId logica indien nodig

  const [formData, setFormData] = useState({
    energy_usage: "",
    house_size: "",
    insulation_level: "",
    battery_capacity: "",
    battery_efficiency: "",
    charge_rate: "",
    energy_cost: "",
    return_rate: "",
    use_dynamic_prices: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/simulatie",
        { ...formData, user_id: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      navigate(`/simulatie-results/${userId}`); // Doorsturen naar de resultatenpagina
    } catch (error) {
      console.error("Fout bij het opslaan van de simulatie:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulatie-form-container">
      <h1>Nieuwe Simulatie</h1>
      <form onSubmit={handleSubmit}>
        {/* Formuliervelden */}
        <div className="form-group">
          <label>Energy Usage (kWh)</label>
          <select
            name="energy_usage"
            value={formData.energy_usage}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="1000">1000 kWh</option>
            <option value="2000">2000 kWh</option>
            <option value="3000">3000 kWh</option>
          </select>
        </div>

        <div className="form-group">
          <label>House Size (m²)</label>
          <select
            name="house_size"
            value={formData.house_size}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="50">50 m²</option>
            <option value="100">100 m²</option>
            <option value="150">150 m²</option>
          </select>
        </div>

        <div className="form-group">
          <label>Insulation Level</label>
          <select
            name="insulation_level"
            value={formData.insulation_level}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="low">Laag</option>
            <option value="medium">Middel</option>
            <option value="high">Hoog</option>
          </select>
        </div>

        <div className="form-group">
          <label>Battery Capacity (kWh)</label>
          <select
            name="battery_capacity"
            value={formData.battery_capacity}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="5">5 kWh</option>
            <option value="10">10 kWh</option>
            <option value="20">20 kWh</option>
          </select>
        </div>

        <div className="form-group">
          <label>Battery Efficiency (%)</label>
          <select
            name="battery_efficiency"
            value={formData.battery_efficiency}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="80">80%</option>
            <option value="90">90%</option>
            <option value="95">95%</option>
          </select>
        </div>

        <div className="form-group">
          <label>Charge Rate (kW)</label>
          <select
            name="charge_rate"
            value={formData.charge_rate}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="2">2 kW</option>
            <option value="5">5 kW</option>
            <option value="10">10 kW</option>
          </select>
        </div>

        <div className="form-group">
          <label>Energy Cost (€/kWh)</label>
          <select
            name="energy_cost"
            value={formData.energy_cost}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="0.2">€0.20</option>
            <option value="0.3">€0.30</option>
            <option value="0.4">€0.40</option>
          </select>
        </div>

        <div className="form-group">
          <label>Return Rate (€/kWh)</label>
          <select
            name="return_rate"
            value={formData.return_rate}
            onChange={handleChange}
            required
          >
            <option value="">Kies...</option>
            <option value="0.1">€0.10</option>
            <option value="0.15">€0.15</option>
            <option value="0.2">€0.20</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="use_dynamic_prices"
              checked={formData.use_dynamic_prices}
              onChange={handleChange}
            />
            Gebruik dynamische prijzen
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Opslaan..." : "Opslaan"}
        </button>
      </form>
    </div>
  );
};

export default SimulatieForm;
