import axios from "axios";

export const saveSimulatie = async (simulatieData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/simulatie", simulatieData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving simulatie:", error);
    throw error;
  }
};
