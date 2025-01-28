export const calculateCost = (prices, usage) =>
    prices.reduce((total, price, index) => total + price * usage[index], 0);
  
  // Function to calculate solar output based on form data
  export const calculateSolarOutput = (formData) => {
    const { panels, panelPower, sunshineHours, panelEfficiency, days = 15 } = formData;
    const panelEfficiencyFactor = panelEfficiency / 100; // Convert to decimal
    const panelPowerKw = panelPower / 1000; // Convert to kW
    const sunshineHoursInHours = sunshineHours.map(duration => duration / 3600); // Convert to hours
  
    const solarDailyOutput = sunshineHoursInHours.map(hours => {
      const dailyOutput = panels * panelPowerKw * hours * panelEfficiencyFactor;
      return parseFloat(dailyOutput.toFixed(2));
    });
  
    const solar15DayOutput = solarDailyOutput
      .slice(0, Math.min(days, sunshineHoursInHours.length))
      .reduce((sum, output) => sum + output, 0);
  
    return {
      solarDailyOutput,
      solar15DayOutput: parseFloat(solar15DayOutput.toFixed(2)),
    };
  };
  
  // Function to calculate the results
  export const calculateResults = (results, sunshineData, dynamicPrices, hourlyUsage) => {
    if (!results || !sunshineData || sunshineData.length === 0) {
      console.error("Invalid input for results or sunshine data.");
      return null;
    }
  
    // Total energy usage:
    const totalEnergyUsage =
      results.energy_usage_method === "actual"
        ? results.custom_kwh_usage / 2
        : results.energy_usage_method === "high"
        ? 8 * results.residents * 15
        : results.energy_usage_method === "medium"
        ? 5 * results.residents * 15
        : 3 * results.residents * 15;
    const dailyEnergyUsage = totalEnergyUsage / 15;
  
    // Calculate solar output based on simulation data and sunshine hours
    const solarOutput = calculateSolarOutput({
      panels: results.panels,
      panelPower: results.panel_power,
      sunshineHours: sunshineData.slice(0, 15),
      panelEfficiency: results.panel_efficiency,
    });
  
    // Total energy costs for 15 days:
    const dailyEnergyCost = calculateCost(dynamicPrices, hourlyUsage);
    const totalEnergyCosts = dailyEnergyCost.toFixed(2) * 15;
  
    // Sum daily solar output to get the fifteenDay total
    const fifteenDayPanelOutput = solarOutput.solarDailyOutput.reduce((sum, output) => sum + output, 0);
    const dailyPanelOutput = fifteenDayPanelOutput / 15;
  
    const fifteenDaySavings = Math.max(0, totalEnergyCosts - (totalEnergyUsage - fifteenDayPanelOutput) * dynamicPrices.reduce((sum, price) => sum + price, 0) / dynamicPrices.length);
    const dailySavings = fifteenDaySavings / 15;
  
    return {
      fifteenDay: {
        energyUsage: totalEnergyUsage.toFixed(0),
        panelOutput: fifteenDayPanelOutput.toFixed(2),
        savings: fifteenDaySavings.toFixed(2),
        overschot: (fifteenDayPanelOutput - totalEnergyUsage).toFixed(2),
        tekort: (totalEnergyUsage - fifteenDayPanelOutput).toFixed(2),
        energyCost: totalEnergyCosts.toFixed(2),
      },
      daily: {
        energyUsage: dailyEnergyUsage.toFixed(0),
        panelOutput: dailyPanelOutput.toFixed(2),
        savings: dailySavings.toFixed(2),
        overschot: (dailyPanelOutput - dailyEnergyUsage).toFixed(2),
        tekort: (dailyEnergyUsage - dailyPanelOutput).toFixed(2),
        energyCost: dailyEnergyCost.toFixed(2),
        solarOutput: solarOutput.solarDailyOutput,
      },
      solarOutput: solarOutput.solar15DayOutput,
    };
  };
  