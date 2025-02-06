import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

export const SimulationData = (userId) => {
  const [results, setResults] = useState(null);
  const [sunshineData, setSunshineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useAuth();

  // Geocode the location to get the coordinates
  const geocodeLocation = async (location) => {
    const apiKey = "f3527a323e794d8a899c015c3196039e";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
      } else {
        console.error("No results found for the specified location.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/simulation/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setResults(response.data?.[0] || null);
      } catch (err) {
        setError("Unable to fetch simulation data");
      } finally {
        setLoading(false);
      }
    };

    const fetchSunshineData = async () => {
      if (!userData?.location) return;
      try {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today.setDate(today.getDate() + 15)).toISOString().split('T')[0];

        const coordinates = await geocodeLocation(userData.location);
        if (!coordinates) return;
        const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
          params: { latitude: coordinates.lat, longitude: coordinates.lng, daily: ["sunshine_duration"], start_date: startDate, end_date: endDate },
        });
        setSunshineData(response.data.daily.sunshine_duration || []);
      } catch {
        setError("Unable to fetch sunshine data");
      }
    };

    fetchSimulationData();
    fetchSunshineData();
  }, [userId, userData?.location]);

  return { results, sunshineData, loading, error };
};
