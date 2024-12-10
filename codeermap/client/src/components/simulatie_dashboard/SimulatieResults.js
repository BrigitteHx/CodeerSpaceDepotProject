import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./style/Simulatie.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faHome,
  faThermometerHalf,
  faBatteryFull,
  faTachometerAlt,
  faEuroSign,
  faExchangeAlt,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";

const SimulatieResults = () => {
  const { userId } = useParams();
  const [simulaties, setSimulaties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/simulatie/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setSimulaties(response.data);
      } catch (error) {
        console.error("Fout bij het ophalen van simulatiegegevens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div className="simulatie-results-container">
      <h1>Mijn Simulaties</h1>
      {loading ? (
        <p className="loading-message">Gegevens laden...</p>
      ) : simulaties.length > 0 ? (
        <div className="results-grid">
          {simulaties.map((simulatie) => (
            <div key={simulatie.id} className="result-card">
              <h2>Simulatie ID: {simulatie.id}</h2>
              <ul className="result-details">
                <li>
                  <FontAwesomeIcon icon={faBolt} /> Energieverbruik:{" "}
                  <strong>{simulatie.energy_usage} kWh</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faHome} /> Huisgrootte:{" "}
                  <strong>{simulatie.house_size} m²</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faThermometerHalf} /> Isolatieniveau:{" "}
                  <strong>{simulatie.insulation_level}</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faBatteryFull} /> Batterijcapaciteit:{" "}
                  <strong>{simulatie.battery_capacity} kWh</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faTachometerAlt} /> Batterijrendement:{" "}
                  <strong>{simulatie.battery_efficiency}%</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faSyncAlt} /> Laadsnelheid:{" "}
                  <strong>{simulatie.charge_rate} kW</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faEuroSign} /> Energieprijs:{" "}
                  <strong>€{simulatie.energy_cost}/kWh</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faExchangeAlt} /> Terugleverprijs:{" "}
                  <strong>€{simulatie.return_rate}/kWh</strong>
                </li>
                <li>
                  <FontAwesomeIcon icon={faSyncAlt} /> Dynamische prijzen:{" "}
                  <strong>{simulatie.use_dynamic_prices ? "Ja" : "Nee"}</strong>
                </li>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results-message">Geen simulaties gevonden.</p>
      )}
    </div>
  );
};

export default SimulatieResults;
